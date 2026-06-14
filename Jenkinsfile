pipeline {
    agent {
        label 'windows'  // Targets a Windows Jenkins agent
    }

    environment {
        CI = 'true'
        NODE_VERSION = '20'
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
                bat 'npx playwright test --reporter=html'
            }
        }

    }

    post {
        always {
            // Archive the HTML report
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            // Archive test results and traces
            archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
        }

        success {
            echo 'All tests passed!'
        }

        failure {
            echo 'Some tests failed. Check the Playwright HTML report in the artifacts.'
        }
    }
}
