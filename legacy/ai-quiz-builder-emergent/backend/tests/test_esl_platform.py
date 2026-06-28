"""
Backend tests for Ministar Game Studio ESL/EFL Teaching Platform
Tests: Auth, Worksheets, Games, Landing Page, Print QR, Re-analyze
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_TEACHER_EMAIL = "testteacher@test.com"
TEST_TEACHER_PASSWORD = "test123"


class TestHealthAndAuth:
    """Authentication and basic health tests"""
    
    def test_api_base_accessible(self):
        """Test that API is accessible"""
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": "Bearer invalid"})
        # Should return 401 for invalid token, not 500
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ API is accessible and returns proper auth error")
    
    def test_teacher_login_success(self):
        """Test teacher login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_TEACHER_EMAIL,
            "password": TEST_TEACHER_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "token" in data, "Token missing in response"
        assert "user" in data, "User missing in response"
        assert data["user"]["role"] == "teacher", "User role should be teacher"
        assert data["user"]["email"] == TEST_TEACHER_EMAIL
        print(f"✅ Teacher login successful: {data['user']['name']}")
    
    def test_teacher_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrongemail@test.com",
            "password": "wrongpass"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ Invalid credentials correctly rejected")


class TestWorksheetOperations:
    """Worksheet CRUD and analysis tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for authenticated requests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_TEACHER_EMAIL,
            "password": TEST_TEACHER_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Auth failed - skipping authenticated tests")
        return response.json()["token"]
    
    def test_get_worksheets_list(self, auth_token):
        """Test fetching all worksheets for teacher"""
        response = requests.get(
            f"{BASE_URL}/api/worksheets",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Failed to get worksheets: {response.text}"
        data = response.json()
        assert isinstance(data, list), "Should return a list of worksheets"
        print(f"✅ Retrieved {len(data)} worksheets")
        return data
    
    def test_analyze_pronouns_worksheet(self, auth_token):
        """Test AI analysis correctly identifies Pronouns theme"""
        form_data = {
            "text": "Personal Pronouns: I, You, He, She, It, We, They. Example: I am happy. You are my friend. He is a boy.",
            "title": "TEST_Pronouns_Worksheet",
            "instruction_language": "ja"
        }
        response = requests.post(
            f"{BASE_URL}/api/worksheets/analyze-text",
            data=form_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Analysis failed: {response.text}"
        data = response.json()
        assert data["analysis"]["theme"].lower() == "pronouns", f"Expected theme 'Pronouns', got '{data['analysis']['theme']}'"
        print(f"✅ Pronouns worksheet analyzed correctly - Theme: {data['analysis']['theme']}")
        return data
    
    def test_analyze_colors_worksheet(self, auth_token):
        """Test AI analysis correctly identifies Colors theme"""
        form_data = {
            "text": "Learn Colors: Red, Blue, Green, Yellow, Orange, Purple, Pink. The apple is red. The sky is blue.",
            "title": "TEST_Colors_Worksheet",
            "instruction_language": "en"
        }
        response = requests.post(
            f"{BASE_URL}/api/worksheets/analyze-text",
            data=form_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Analysis failed: {response.text}"
        data = response.json()
        assert "color" in data["analysis"]["theme"].lower(), f"Expected theme with 'Colors', got '{data['analysis']['theme']}'"
        print(f"✅ Colors worksheet analyzed correctly - Theme: {data['analysis']['theme']}")
        return data
    
    def test_analyze_animals_worksheet(self, auth_token):
        """Test AI analysis correctly identifies Animals theme"""
        form_data = {
            "text": "Farm Animals: Cow, Pig, Sheep, Horse, Chicken, Duck, Goat. A cow says moo. A pig says oink.",
            "title": "TEST_Animals_Worksheet",
            "instruction_language": "en"
        }
        response = requests.post(
            f"{BASE_URL}/api/worksheets/analyze-text",
            data=form_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Analysis failed: {response.text}"
        data = response.json()
        assert "animal" in data["analysis"]["theme"].lower(), f"Expected theme with 'Animals', got '{data['analysis']['theme']}'"
        print(f"✅ Animals worksheet analyzed correctly - Theme: {data['analysis']['theme']}")
        return data


class TestReanalyzeFeature:
    """Re-analyze button functionality tests"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_TEACHER_EMAIL,
            "password": TEST_TEACHER_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Auth failed")
        return response.json()["token"]
    
    @pytest.fixture
    def existing_worksheet_id(self, auth_token):
        """Get an existing worksheet ID"""
        response = requests.get(
            f"{BASE_URL}/api/worksheets",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        if response.status_code != 200 or len(response.json()) == 0:
            pytest.skip("No worksheets available")
        return response.json()[0]["id"]
    
    def test_reanalyze_worksheet(self, auth_token, existing_worksheet_id):
        """Test re-analyze triggers new AI analysis"""
        response = requests.post(
            f"{BASE_URL}/api/worksheets/{existing_worksheet_id}/reanalyze",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Re-analyze failed: {response.text}"
        data = response.json()
        assert "analysis" in data, "Analysis missing in response"
        assert "theme" in data["analysis"], "Theme missing in analysis"
        print(f"✅ Re-analyze successful - Theme: {data['analysis']['theme']}")
    
    def test_reanalyze_unauthorized(self, auth_token):
        """Test re-analyze requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/worksheets/fake-id/reanalyze",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ Re-analyze correctly requires authentication")


class TestGameCreation:
    """Game generation and management tests"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_TEACHER_EMAIL,
            "password": TEST_TEACHER_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Auth failed")
        return response.json()["token"]
    
    @pytest.fixture
    def existing_worksheet_id(self, auth_token):
        response = requests.get(
            f"{BASE_URL}/api/worksheets",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        if response.status_code != 200 or len(response.json()) == 0:
            pytest.skip("No worksheets available")
        return response.json()[0]["id"]
    
    def test_create_quiz_game(self, auth_token, existing_worksheet_id):
        """Test creating a quiz game"""
        game_data = {
            "worksheet_id": existing_worksheet_id,
            "title": "TEST_Quiz_Game",
            "game_type": "Quiz",
            "content": {
                "questions": [
                    {
                        "id": 0,
                        "question": "What is 'he'?",
                        "options": ["A boy pronoun", "A girl pronoun", "An animal", "A thing"],
                        "correct": 0
                    }
                ]
            },
            "grade_level": "Grade 1",
            "theme": "Pronouns"
        }
        response = requests.post(
            f"{BASE_URL}/api/games/create",
            json=game_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Game creation failed: {response.text}"
        data = response.json()
        assert "share_code" in data, "Share code missing"
        assert "qr_code" in data, "QR code missing"
        assert len(data["share_code"]) == 6, "Share code should be 6 characters"
        print(f"✅ Quiz game created - Share code: {data['share_code']}")
        return data
    
    def test_get_games_by_worksheet(self, auth_token, existing_worksheet_id):
        """Test fetching games for a worksheet"""
        response = requests.get(
            f"{BASE_URL}/api/games/worksheet/{existing_worksheet_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Failed to get games: {response.text}"
        data = response.json()
        assert isinstance(data, list), "Should return a list"
        print(f"✅ Retrieved {len(data)} games for worksheet")
    
    def test_get_game_by_share_code(self, auth_token, existing_worksheet_id):
        """Test accessing game by share code (public)"""
        # First get a game to find its share code
        games_response = requests.get(
            f"{BASE_URL}/api/games/worksheet/{existing_worksheet_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        if games_response.status_code != 200 or len(games_response.json()) == 0:
            pytest.skip("No games available")
        
        share_code = games_response.json()[0]["share_code"]
        
        # Access game by share code (public endpoint)
        response = requests.get(f"{BASE_URL}/api/games/by-code/{share_code}")
        assert response.status_code == 200, f"Failed to get game by code: {response.text}"
        data = response.json()
        assert data["share_code"] == share_code.upper()
        print(f"✅ Game accessible by share code: {share_code}")


class TestGamesLandingPage:
    """Games Landing Page tests (QR code access)"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_TEACHER_EMAIL,
            "password": TEST_TEACHER_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Auth failed")
        return response.json()["token"]
    
    @pytest.fixture
    def existing_worksheet_id(self, auth_token):
        response = requests.get(
            f"{BASE_URL}/api/worksheets",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        if response.status_code != 200 or len(response.json()) == 0:
            pytest.skip("No worksheets available")
        return response.json()[0]["id"]
    
    def test_landing_page_public_access(self, auth_token, existing_worksheet_id):
        """Test landing page is publicly accessible (no auth required)"""
        response = requests.get(f"{BASE_URL}/api/worksheets/landing/{existing_worksheet_id}")
        assert response.status_code == 200, f"Landing page failed: {response.text}"
        data = response.json()
        
        # Verify worksheet info
        assert "worksheet" in data, "Worksheet info missing"
        assert "id" in data["worksheet"]
        assert "title" in data["worksheet"]
        assert "theme" in data["worksheet"]
        assert "grade_level" in data["worksheet"]
        
        # Verify games list
        assert "games" in data, "Games list missing"
        assert isinstance(data["games"], list)
        
        print(f"✅ Landing page accessible - Worksheet: {data['worksheet']['title']}, Games: {len(data['games'])}")
    
    def test_landing_page_invalid_worksheet(self):
        """Test landing page with invalid worksheet ID"""
        response = requests.get(f"{BASE_URL}/api/worksheets/landing/invalid-id-12345")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✅ Invalid worksheet correctly returns 404")
    
    def test_landing_page_game_structure(self, auth_token, existing_worksheet_id):
        """Test landing page returns proper game structure"""
        response = requests.get(f"{BASE_URL}/api/worksheets/landing/{existing_worksheet_id}")
        assert response.status_code == 200
        data = response.json()
        
        if len(data["games"]) > 0:
            game = data["games"][0]
            assert "id" in game, "Game ID missing"
            assert "title" in game, "Game title missing"
            assert "game_type" in game, "Game type missing"
            assert "share_code" in game, "Share code missing"
            assert "plays" in game, "Plays count missing"
            print(f"✅ Game structure correct - Title: {game['title']}, Type: {game['game_type']}")
        else:
            print("⚠️ No games to verify structure (skipping)")


class TestPrintQRWorksheet:
    """Print QR Worksheet PDF generation tests"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_TEACHER_EMAIL,
            "password": TEST_TEACHER_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Auth failed")
        return response.json()["token"]
    
    @pytest.fixture
    def worksheet_with_games(self, auth_token):
        """Get worksheet that has games"""
        worksheets_response = requests.get(
            f"{BASE_URL}/api/worksheets",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        if worksheets_response.status_code != 200:
            pytest.skip("Cannot get worksheets")
        
        worksheets = worksheets_response.json()
        for ws in worksheets:
            games_response = requests.get(
                f"{BASE_URL}/api/games/worksheet/{ws['id']}",
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            if games_response.status_code == 200 and len(games_response.json()) > 0:
                return ws["id"]
        
        pytest.skip("No worksheet with games found")
    
    def test_print_qr_pdf_generation(self, auth_token, worksheet_with_games):
        """Test PDF generation for QR worksheet"""
        response = requests.get(
            f"{BASE_URL}/api/worksheets/{worksheet_with_games}/print-qr",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"PDF generation failed: {response.text}"
        
        # Check content type is PDF
        assert "application/pdf" in response.headers.get("content-type", ""), "Response should be PDF"
        
        # Check PDF starts with PDF magic bytes
        assert response.content[:4] == b'%PDF', "Content should be valid PDF"
        
        # Check content-disposition header for filename
        content_disp = response.headers.get("content-disposition", "")
        assert "attachment" in content_disp, "Should be attachment download"
        assert ".pdf" in content_disp, "Filename should end with .pdf"
        
        print(f"✅ PDF generated successfully - Size: {len(response.content)} bytes")
    
    def test_print_qr_requires_auth(self, worksheet_with_games):
        """Test PDF generation requires authentication"""
        response = requests.get(
            f"{BASE_URL}/api/worksheets/{worksheet_with_games}/print-qr"
        )
        assert response.status_code in [401, 403], f"Expected auth error, got {response.status_code}"
        print("✅ PDF generation correctly requires authentication")
    
    def test_print_qr_no_games(self, auth_token):
        """Test PDF generation fails gracefully when no games exist"""
        # Create a new worksheet without games
        form_data = {
            "text": "TEST_NoGames: Just a test worksheet",
            "title": "TEST_No_Games_Worksheet",
            "instruction_language": "en"
        }
        create_response = requests.post(
            f"{BASE_URL}/api/worksheets/analyze-text",
            data=form_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        if create_response.status_code != 200:
            pytest.skip("Could not create test worksheet")
        
        worksheet_id = create_response.json()["id"]
        
        # Try to generate PDF without creating games
        response = requests.get(
            f"{BASE_URL}/api/worksheets/{worksheet_id}/print-qr",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        # Should return 400 error
        assert response.status_code == 400, f"Expected 400 for no games, got {response.status_code}"
        print("✅ PDF generation correctly fails when no games exist")


class TestTeacherStats:
    """Teacher statistics tests"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_TEACHER_EMAIL,
            "password": TEST_TEACHER_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Auth failed")
        return response.json()["token"]
    
    def test_get_teacher_stats(self, auth_token):
        """Test fetching teacher statistics"""
        response = requests.get(
            f"{BASE_URL}/api/teacher/stats",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Failed to get stats: {response.text}"
        data = response.json()
        
        assert "active_students" in data
        assert "worksheets_created" in data
        assert "games_played" in data
        assert "average_engagement" in data
        
        print(f"✅ Teacher stats retrieved - Worksheets: {data['worksheets_created']}, Games played: {data['games_played']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
