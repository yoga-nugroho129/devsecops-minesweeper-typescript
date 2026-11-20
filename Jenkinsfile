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
                sh 'npm ci --cache /tmp/npm-cache'
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
                script {
                    def scannerHome = tool name: 'SonarScanner'

                    echo "SonarScanner home: ${scannerHome}"

                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
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
                sh '''
                    docker build \
                        --platform linux/amd64 \
                        --tag devsecops-minesweeper:${BUILD_NUMBER} \
                        .
                '''
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                    trivy image \
                        --severity HIGH, CRITICAL \
                        --exit-code 1 \
                        devsecops-minesweeper:${BUILD_NUMBER}
                '''
            }
        }

        stage('Push Docker Hub') {
            steps {
                echo 'Docker Hub push will be configured next'
            }
        }
    }
}