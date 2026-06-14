pipeline {
    agent any  // Run on whichever agent is available

    environment {
        CI = 'true'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                bat 'npx playwright install chromium --with-deps'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                // Wipe previous results so old data doesn't bleed in
                bat 'if exist allure-results rmdir /s /q allure-results'
                bat 'npx playwright test'
            }
        }

        stage('Generate Allure Report') {
            steps {
                // Requires the Allure Jenkins plugin + Allure CLI on the agent PATH
                allure([
                    includeProperties: false,
                    jdk              : '',
                    reportBuildPolicy: 'ALWAYS',
                    results          : [[path: 'allure-results']]
                ])
            }
        }

    }

    post {
        always {
            // Archive the raw Allure results as a fallback
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true

            // Archive the Playwright HTML report as well
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }

        success {
            echo 'All tests passed!'
        }

        failure {
            echo 'Some tests failed. Check the Allure report for details.'
        }
    }
}
