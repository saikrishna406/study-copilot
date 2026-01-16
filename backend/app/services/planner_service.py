
import json
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.core.config import settings
from app.core.auth import get_supabase_client
import openai

class PlannerService:
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.supabase = get_supabase_client()

    async def generate_study_plan(self, user_id: str, document_ids: List[str], exam_date: str, hours_per_day: int) -> Dict[str, Any]:
        
        # 1. Fetch document text
        documents_text = ""
        for doc_id in document_ids:
            try:
                # Get document chunks or summary to save context window
                # For now using summary if available, else first few chunks
                doc = self.supabase.table("documents").select("title, summary").eq("id", doc_id).single().execute()
                if doc.data:
                    title = doc.data.get('title', 'Untitled')
                    summary = doc.data.get('summary', '')
                    documents_text += f"-- Document: {title} --\nSummary: {summary}\n\n"
                    
                    # If summary is missing/short, maybe get some chunks (optional optimization)
            except Exception as e:
                print(f"Error fetching document {doc_id}: {e}")

        # 2. Calculate duration
        start = datetime.now()
        end = datetime.strptime(exam_date, "%Y-%m-%d")
        days_available = (end - start).days
        
        if days_available <= 0:
            raise Exception("Exam date must be in the future")

        # 3. Prompt LLM
        prompt = f"""
        You are an expert personalized study planner. Create a detailed {days_available}-day study plan for a student preparing for an exam on {exam_date}.
        They have {hours_per_day} hours available per day.
        
        Here is the context of the study material:
        {documents_text}
        
        Rules:
        1. Break down the material into logical topics.
        2. Distribute topics across the {days_available} days.
        3. Include specific "Review" or "Buffer" days.
        4. Include a daily "Mock Test" or "Practice" session in the final days.
        5. Output strictly valid JSON with this structure:
        {{
            "title": "Study Plan for [Subject]",
            "days": [
                {{
                    "day_number": 1,
                    "date": "YYYY-MM-DD",
                    "topics": ["Topic 1", "Topic 2"],
                    "tasks": [
                        {{ "id": "t1", "description": "Read Chapter 1", "duration_minutes": 60, "type": "reading" }},
                        {{ "id": "t2", "description": "Practice Quiz 1", "duration_minutes": 30, "type": "practice" }}
                    ]
                }}
            ]
        }}
        """

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful study planning assistant that outputs strict JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={ "type": "json_object" }
            )
            
            plan_json = json.loads(response.choices[0].message.content)
            
            # Save to DB
            data = {
                "user_id": user_id,
                "document_ids": document_ids,
                "title": plan_json.get("title", "Generated Study Plan"),
                "plan": plan_json,
                "duration_days": days_available,
                "hours_per_day": hours_per_day,
                "start_date": start.strftime("%Y-%m-%d"),
                "exam_date": exam_date,
                "status": "active"
            }
            
            result = self.supabase.table("study_plans").insert(data).execute()
            if not result.data:
                raise Exception("Failed to save plan to database")
                
            return result.data[0]

        except Exception as e:
            print(f"Plan generation failed: {e}")
            raise Exception(f"Failed to generate plan: {e}")

    async def get_user_plans(self, user_id: str):
        result = self.supabase.table("study_plans").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return result.data

    async def update_task_status(self, plan_id: str, day_number: int, task_id: str, is_completed: bool, user_id: str):
        # 1. Fetch current plan
        result = self.supabase.table("study_plans").select("plan").eq("id", plan_id).eq("user_id", user_id).single().execute()
        if not result.data:
            raise Exception("Plan not found")
            
        plan_data = result.data['plan']
        
        # 2. Update local JSON state
        updated = False
        for day in plan_data.get('days', []):
            if day.get('day_number') == day_number:
                for task in day.get('tasks', []):
                    if task.get('id') == task_id:
                        task['completed'] = is_completed
                        updated = True
                        break
            if updated: break
            
        if updated:
            self.supabase.table("study_plans").update({"plan": plan_data}).eq("id", plan_id).execute()
            return True
        return False
