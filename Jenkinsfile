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
        waitForQualityGate abortPipeline: true
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