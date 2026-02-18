pipeline {
  agent any

  stages {
    stage('build') {
      steps {
        sh '''ls -la
        mvn install -DskipTests
        ls -la'''
        stash(name: 'build', includes: '**/target/**')
      }
    }

    stage('paralleltests') {
      parallel {
        stage('slowtests') {
          steps {
            unstash 'build'
            sh '''ls -la
            mvn test -Dgroups="slow"
            ls -la'''
          }
        }

        stage('fasttests') {
          steps {
            unstash 'build'
            sh '''ls -la
            mvn test -Dgroups="fast"
            ls -la'''
          }
        }
      }
    }

    stage('sonarqube') {
      steps {
        withSonarQubeEnv('SonarQube') {
          sh 'mvn sonar:sonar'
        }

      }
    }

    stage('awaitingonarqube') {
      steps {
        waitForQualityGate true
      }
    }

    stage('heyqaguysandgals') {
      steps {
        unstash 'build'
        sh '''
          ls -la
          java -jar target/demo-0.0.1-SNAPSHOT.jar --server.port=8085 &
        '''
        input(message: 'Hey QA is this ok on port 8085?', ok: 'Yes :)')
      }
    }

    stage('dockerbuildandpushit') {
      environment {
        DOCKER_HUB_LOGIN = credentials('docker-hub')
      }
      steps {
        sh '''
          ls -la
          docker login --username=$DOCKER_HUB_LOGIN_USR --password=$DOCKER_HUB_LOGIN_PSW
          docker build -t jenkins/test1:v1 .
          docker push jenkins/test1:v1
        '''
      }
    }

  }
}
