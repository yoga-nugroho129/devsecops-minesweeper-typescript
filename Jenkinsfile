pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:24-alpine3.22'
                    reuseNode true
                }
            }

            steps {
                sh 'npm ci'
            }
        }

        stage('Test & Coverage') {
            agent {
                docker {
                    image 'node:24-alpine3.22'
                    reuseNode true
                }
            }

            steps {
                sh 'npm run test:coverage'
            }
        }

        stage('Build') {
            agent {
                docker {
                    image 'node:24-alpine3.22'
                    reuseNode true
                }
            }

            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                def scannerHome = tool 'SonarScanner'

                withSonarQubeEnv('SonarQube') {
                    sh '${scannerHome}/bin/sonar-scanner'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Docker build will be configured next'
            }
        }

        stage('Trivy Scan') {
            steps {
                echo 'Trivy scan will be configured next'
            }
        }

        stage('Push Docker Hub') {
            steps {
                echo 'Docker Hub push will be configured next'
            }
        }
    }
}