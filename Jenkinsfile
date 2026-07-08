pipeline {
  agent any
  
  tools {
    maven 'Maven3'
  }
  
  stages {
    stage('Build') {
      steps {
        sh '''ls -la
        mvn install -DskipTests
        ls -la'''
        stash(name: 'build', includes: '**/target/**')
      }
    }

    stage('Parallel Tests') {
      parallel {
        stage('Slow Tests') {
          steps {
            unstash 'build'
            sh 'mvn test -Dgroups="slow"'
          }
        }

        stage('Fast Tests') {
          steps {
            unstash 'build'
            sh 'mvn test -Dgroups="fast"'
          }
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQube') {
          sh 'mvn verify sonar:sonar'
        }

      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 2, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('QA Verification') {
      steps {
        unstash 'build'
        sh '''
          ls -la
          java -jar target/demo-0.0.1-SNAPSHOT.jar --server.port=8085 &
        '''
        input(message: 'Hey QA is this ok on port 8085?', ok: 'Yes :)')
      }
    }

    stage('Cypress E2E Tests') {
      steps {
        unstash 'build'
        sh '''
          # Start Spring Boot app in background
          java -jar target/demo-0.0.1-SNAPSHOT.jar --server.port=8081 &
          APP_PID=$!

          # Wait for app to be ready
          echo "Waiting for Spring Boot to start..."
          for i in $(seq 1 30); do
            if curl -s http://localhost:8081/hithere > /dev/null 2>&1; then
              echo "App is ready!"
              break
            fi
            sleep 2
          done

          # Install dependencies and run Cypress
          npm ci
          npx cypress run

          # Cleanup
          kill $APP_PID || true
        '''
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'cypress/results/*.xml'
        }
      }
    }

    stage('Docker Build and Push') {
      environment {
        DOCKER_HUB_LOGIN = credentials('docker-hub')
      }
      steps {
        sh '''
          docker login --username=$DOCKER_HUB_LOGIN_USR --password=$DOCKER_HUB_LOGIN_PSW
          docker build -t $DOCKER_HUB_LOGIN_USR/demo:v1 .
          docker push $DOCKER_HUB_LOGIN_USR/demo:v1
        '''
      }
    }

  }
}