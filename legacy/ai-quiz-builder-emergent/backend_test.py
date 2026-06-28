#!/usr/bin/env python3
"""
Comprehensive backend API testing for ESL Gamified Curriculum Platform
Tests all authentication, worksheet, and game functionality
"""

import requests
import json
import sys
import time
from datetime import datetime
import tempfile
import os

class ESLPlatformTester:
    def __init__(self, base_url="https://ai-quiz-builder-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.teacher_token = None
        self.student_token = None
        self.teacher_data = None
        self.student_data = None
        self.worksheet_id = None
        self.game_id = None
        self.share_code = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log(self, message):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/api{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        # Add authorization for teacher-related endpoints
        if self.teacher_token and any(keyword in name.lower() for keyword in ['teacher', 'worksheet', 'game', 'stats']):
            test_headers['Authorization'] = f'Bearer {self.teacher_token}'
        elif self.student_token and 'student' in name.lower():
            test_headers['Authorization'] = f'Bearer {self.student_token}'

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                if files:
                    # Remove Content-Type for multipart/form-data
                    if 'Content-Type' in test_headers:
                        del test_headers['Content-Type']
                    response = requests.post(url, files=files, data=data, headers=test_headers, timeout=30)
                elif '/analyze-text' in endpoint:
                    # Form data for analyze-text endpoint
                    if 'Content-Type' in test_headers:
                        del test_headers['Content-Type']
                    response = requests.post(url, data=data, headers=test_headers, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"✅ PASSED - {name} - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                self.log(f"❌ FAILED - {name} - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    self.log(f"   Error: {error_detail}")
                except:
                    self.log(f"   Response: {response.text[:200]}")
                
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'endpoint': endpoint
                })
                return False, {}

        except requests.exceptions.Timeout:
            self.log(f"❌ FAILED - {name} - Request timeout")
            self.failed_tests.append({
                'test': name,
                'error': 'Request timeout',
                'endpoint': endpoint
            })
            return False, {}
        except Exception as e:
            self.log(f"❌ FAILED - {name} - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e),
                'endpoint': endpoint
            })
            return False, {}

    def test_teacher_registration(self):
        """Test teacher registration"""
        teacher_email = f"teacher_{int(time.time())}@test.com"
        teacher_data = {
            "email": teacher_email,
            "password": "TeacherPass123!",
            "name": "Test Teacher",
            "role": "teacher"
        }
        
        success, response = self.run_test(
            "Teacher Registration",
            "POST",
            "/auth/register",
            200,
            data=teacher_data
        )
        
        if success and response.get('token'):
            self.teacher_token = response['token']
            self.teacher_data = response['user']
            self.log(f"   Teacher registered: {teacher_email}")
            return True
        return False

    def test_student_registration(self):
        """Test student registration"""
        student_email = f"student_{int(time.time())}@test.com"
        student_data = {
            "email": student_email,
            "password": "StudentPass123!",
            "name": "Test Student",
            "role": "student"
        }
        
        success, response = self.run_test(
            "Student Registration",
            "POST",
            "/auth/register",
            200,
            data=student_data
        )
        
        if success and response.get('token'):
            self.student_token = response['token']
            self.student_data = response['user']
            self.log(f"   Student registered: {student_email}")
            return True
        return False

    def test_teacher_login(self):
        """Test teacher login with existing credentials"""
        if not self.teacher_data:
            return False
            
        login_data = {
            "email": self.teacher_data['email'],
            "password": "TeacherPass123!"
        }
        
        success, response = self.run_test(
            "Teacher Login",
            "POST",
            "/auth/login",
            200,
            data=login_data
        )
        
        return success and response.get('token')

    def test_auth_me(self):
        """Test get current user endpoint"""
        success, response = self.run_test(
            "Teacher Auth Me",
            "GET",
            "/auth/me",
            200
        )
        
        return success and response.get('email') == self.teacher_data['email']

    def test_teacher_stats(self):
        """Test teacher dashboard stats"""
        success, response = self.run_test(
            "Teacher Stats",
            "GET",
            "/teacher/stats",
            200
        )
        
        if success:
            required_fields = ['active_students', 'worksheets_created', 'games_played', 'average_engagement']
            has_all_fields = all(field in response for field in required_fields)
            if has_all_fields:
                self.log(f"   Stats: {response}")
            return has_all_fields
        return False

    def test_text_worksheet_upload(self):
        """Test text-based worksheet creation"""
        worksheet_data = {
            "text": """Animals Worksheet
            
            Match the animals with their habitats:
            1. Fish - Water
            2. Bird - Sky  
            3. Lion - Jungle
            4. Penguin - Antarctica
            5. Elephant - Savanna
            
            Vocabulary words: fish, bird, lion, penguin, elephant, water, sky, jungle, antarctica, savanna, habitat, animals""",
            "title": "Animals and Habitats Worksheet"
        }
        
        # Use custom headers to exclude Content-Type for form data
        success, response = self.run_test(
            "Text Worksheet Upload",
            "POST",
            "/worksheets/analyze-text",
            200,
            data=worksheet_data,
            headers={'Authorization': f'Bearer {self.teacher_token}'}
        )
        
        if success and response.get('id'):
            self.worksheet_id = response['id']
            self.log(f"   Worksheet created: {self.worksheet_id}")
            self.log(f"   Analysis: {response.get('analysis', {})}")
            return True
        return False

    def test_get_worksheets(self):
        """Test retrieving teacher's worksheets"""
        success, response = self.run_test(
            "Get Teacher Worksheets",
            "GET",
            "/worksheets",
            200
        )
        
        if success and isinstance(response, list):
            self.log(f"   Found {len(response)} worksheets")
            return True
        return False

    def test_get_worksheet_by_id(self):
        """Test retrieving specific worksheet"""
        if not self.worksheet_id:
            return False
            
        success, response = self.run_test(
            "Get Worksheet by ID",
            "GET",
            f"/worksheets/{self.worksheet_id}",
            200
        )
        
        return success and response.get('id') == self.worksheet_id

    def test_create_word_match_game(self):
        """Test creating a Word Match game"""
        if not self.worksheet_id:
            return False
            
        game_content = {
            "pairs": [
                {"id": 0, "word": "Fish", "match": "Lives in water"},
                {"id": 1, "word": "Bird", "match": "Flies in the sky"},
                {"id": 2, "word": "Lion", "match": "King of the jungle"},
                {"id": 3, "word": "Penguin", "match": "Lives in Antarctica"},
                {"id": 4, "word": "Elephant", "match": "Large savanna animal"}
            ]
        }
        
        game_data = {
            "worksheet_id": self.worksheet_id,
            "title": "Animal Word Match",
            "game_type": "Word Match",
            "content": game_content,
            "grade_level": "Grade 2",
            "theme": "Animals"
        }
        
        success, response = self.run_test(
            "Create Word Match Game",
            "POST",
            "/games/create",
            200,
            data=game_data
        )
        
        if success and response.get('id'):
            self.game_id = response['id']
            self.share_code = response.get('share_code')
            self.log(f"   Game created: {self.game_id}")
            self.log(f"   Share code: {self.share_code}")
            return True
        return False

    def test_create_quiz_game(self):
        """Test creating a Quiz game"""
        if not self.worksheet_id:
            return False
            
        quiz_content = {
            "questions": [
                {
                    "id": 0,
                    "question": "Where do fish live?",
                    "options": ["Water", "Sky", "Jungle", "Antarctica"],
                    "correct": 0
                },
                {
                    "id": 1,
                    "question": "What animal is known as the king of the jungle?",
                    "options": ["Elephant", "Penguin", "Lion", "Fish"],
                    "correct": 2
                }
            ]
        }
        
        game_data = {
            "worksheet_id": self.worksheet_id,
            "title": "Animal Quiz",
            "game_type": "Quiz",
            "content": quiz_content,
            "grade_level": "Grade 2",
            "theme": "Animals"
        }
        
        success, response = self.run_test(
            "Create Quiz Game",
            "POST",
            "/games/create",
            200,
            data=game_data
        )
        
        return success and response.get('id')

    def test_get_teacher_games(self):
        """Test retrieving teacher's games"""
        success, response = self.run_test(
            "Get Teacher Games",
            "GET",
            "/games/teacher",
            200
        )
        
        if success and isinstance(response, list):
            self.log(f"   Found {len(response)} games")
            return len(response) > 0
        return False

    def test_get_games_by_worksheet(self):
        """Test retrieving games by worksheet ID"""
        if not self.worksheet_id:
            return False
            
        success, response = self.run_test(
            "Get Games by Worksheet",
            "GET",
            f"/games/worksheet/{self.worksheet_id}",
            200
        )
        
        if success and isinstance(response, list):
            self.log(f"   Found {len(response)} games for worksheet")
            return True
        return False

    def test_get_game_by_code(self):
        """Test accessing game by share code (student access)"""
        if not self.share_code:
            return False
            
        success, response = self.run_test(
            "Get Game by Code",
            "GET",
            f"/games/by-code/{self.share_code}",
            200
        )
        
        if success and response.get('share_code') == self.share_code:
            self.log(f"   Game accessible via code: {self.share_code}")
            return True
        return False

    def test_create_game_session(self):
        """Test creating game session (student completing game)"""
        if not self.game_id:
            return False
            
        session_data = {
            "game_id": self.game_id,
            "student_id": self.student_data.get('id') if self.student_data else None,
            "score": 85,
            "completed": True,
            "time_spent": 120
        }
        
        success, response = self.run_test(
            "Create Game Session",
            "POST",
            "/game-sessions",
            200,
            data=session_data
        )
        
        return success and response.get('game_id') == self.game_id

    def test_get_game_sessions(self):
        """Test retrieving game sessions"""
        if not self.game_id:
            return False
            
        success, response = self.run_test(
            "Get Game Sessions",
            "GET",
            f"/game-sessions/game/{self.game_id}",
            200
        )
        
        if success and isinstance(response, list):
            self.log(f"   Found {len(response)} game sessions")
            return True
        return False

    def test_invalid_endpoints(self):
        """Test error handling for invalid requests"""
        # Test invalid login
        success, _ = self.run_test(
            "Invalid Login",
            "POST",
            "/auth/login",
            401,
            data={"email": "invalid@test.com", "password": "wrong"}
        )
        
        # Test accessing non-existent game
        success2, _ = self.run_test(
            "Non-existent Game",
            "GET",
            "/games/by-code/INVALID",
            404
        )
        
        return success and success2

    def run_all_tests(self):
        """Run comprehensive test suite"""
        self.log("🚀 Starting ESL Platform Backend API Testing")
        self.log(f"🌐 Base URL: {self.base_url}")
        
        # Authentication tests
        self.log("\n📝 AUTHENTICATION TESTS")
        self.test_teacher_registration()
        self.test_student_registration()
        self.test_teacher_login()
        self.test_auth_me()
        
        # Teacher functionality tests
        self.log("\n👩‍🏫 TEACHER FUNCTIONALITY TESTS")
        self.test_teacher_stats()
        self.test_text_worksheet_upload()
        self.test_get_worksheets()
        self.test_get_worksheet_by_id()
        
        # Game creation tests
        self.log("\n🎮 GAME CREATION TESTS")
        self.test_create_word_match_game()
        self.test_create_quiz_game()
        self.test_get_teacher_games()
        self.test_get_games_by_worksheet()
        
        # Student/Game access tests
        self.log("\n🎯 GAME ACCESS TESTS")
        self.test_get_game_by_code()
        self.test_create_game_session()
        self.test_get_game_sessions()
        
        # Error handling tests
        self.log("\n⚠️ ERROR HANDLING TESTS")
        self.test_invalid_endpoints()
        
        # Summary
        self.log(f"\n📊 TEST SUMMARY")
        self.log(f"   Tests Run: {self.tests_run}")
        self.log(f"   Tests Passed: {self.tests_passed}")
        self.log(f"   Tests Failed: {self.tests_run - self.tests_passed}")
        self.log(f"   Success Rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        if self.failed_tests:
            self.log(f"\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                error_msg = test.get('error', f"Expected {test.get('expected', 'N/A')}, got {test.get('actual', 'N/A')}")
                self.log(f"   - {test['test']}: {error_msg}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = ESLPlatformTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())