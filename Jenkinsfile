pipeline {
    agent any

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
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }

    }

    post {
        always {
            // Archive screenshots, videos, HTML report, and Allure results
            archiveArtifacts artifacts: 'screenshot/**, playwright-report/**, allure-results/**', allowEmptyArchive: true
        }

        success {
            echo 'All tests passed!'
        }

        failure {
            echo 'Some tests failed. Check the archived playwright-report for details.'
        }
    }
}
