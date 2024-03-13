pipeline {
agent {
  label 'slave-1'
      }
environment {
      BUILD_DEV = 'npm run build-dev'
      BUILD_STAGE = 'npm run build-stage'
      BUILD_PROD = 'npm run build-preprod'
      PATH = "/opt/sonar-scanner/bin:$PATH"
    }


stages{
    // Code quality checks
    stage('SonarQube analysis for Feature-Branch') {
            when { 
                expression {return (env.CHANGE_BRANCH ==~ /^(feature|fix|hotfix)\/.*$/) && env.CHANGE_TARGET == 'master' }
             }
            steps {
                 //  withSonarQubeEnv('SCHOOL_SONAR_HOST_URL') {
                   // sh 'sonar-scanner -Dsonar.projectKey=erp-admin-pwa -Dsonar.projectName="erp-admin-pwa" -Dsonar.qualitygate.wait=true -Dsonar.login=a96ff97ab1cc42f59aef34e549a4b63cecbbe021'
                    echo "Auto mergening"
                    echo "SOURCE_BRANCH: ${env.CHANGE_BRANCH } ----> TARGET_BRANCH: ${env.CHANGE_TARGET}"
                    sh 'rm -rf erp-admin-pwa'
                    sh 'git clone git@bitbucket.org-harsha-anadariya:solutionanalystspvtltd/erp-admin-pwa.git'
                    dir('erp-admin-pwa')
                    {
                    sh 'git fetch origin'
                    sh 'git branch -a' 
                    sh 'git config --global user.email harsha.anadariya@solutionanalysts.com'
                    sh 'git config --global user.name harsha-anadariya'
                    sh 'git checkout $CHANGE_TARGET' 
                    sh 'git merge origin/$CHANGE_BRANCH'
                    sh 'git push origin $CHANGE_TARGET'      
            }
            }
        }   
   
    stage('Build for DEV') {
        when {
            branch 'master'
        }
        steps {
            echo "Build started"
            sh "sed -i 's/build_Command/$BUILD_DEV/g' Dockerfile"
            sh "docker build -t erp-admin-pwa-image-dev-$BUILD_NUMBER ."
        }
    }  

    stage('Deploying to DEV server') {
        when {
            branch 'master'
        }
        steps {
            echo "Deployment started"
            sh "docker run --name erp-admin-pwa-container-dev-$BUILD_NUMBER -d erp-admin-pwa-image-dev-$BUILD_NUMBER"
            sh "docker cp erp-admin-pwa-container-dev-$BUILD_NUMBER:/app/dist-dev/. ./dist-dev/"
            withAWS(region:'ap-south-1',credentials:'School-erp') {
                   sh "aws s3 sync dist-dev/ s3://dev-erp-admin-pwa/"
                   sh "aws cloudfront create-invalidation --distribution-id E3TT56WFOJBY9G --paths '/*'"
               }
            sh "docker rm erp-admin-pwa-container-dev-$BUILD_NUMBER"
            sh "docker rmi erp-admin-pwa-image-dev-$BUILD_NUMBER"   
        }
    } 

    stage('Build for stage') {
        when {
            branch 'stage'
        }
        steps {
            echo "Build started"
            sh "sed -i 's/build_Command/$BUILD_STAGE/g' Dockerfile"
            sh "docker build -t erp-admin-pwa-image-stage-$BUILD_NUMBER ."
        }
    }  

    stage('Deploying to stage server') {
        when {
            branch 'stage'
        }
        steps {
            echo "Deployment started"
            sh "docker run --name erp-admin-pwa-container-stage-$BUILD_NUMBER -d erp-admin-pwa-image-stage-$BUILD_NUMBER"
            sh "docker cp erp-admin-pwa-container-stage-$BUILD_NUMBER:/app/dist-stage/. ./dist-stage/"
            withAWS(region:'ap-south-1',credentials:'School-erp') {
                   sh "aws s3 sync dist-stage/ s3://stage-erp-admin-pwa/"
                   sh "aws cloudfront create-invalidation --distribution-id E2WJTM9171U2OY --paths '/*'"
               }
            sh "docker rm erp-admin-pwa-container-stage-$BUILD_NUMBER"
            sh "docker rmi erp-admin-pwa-image-stage-$BUILD_NUMBER"   
        }
    }

    stage('Build for prod') {
        when {
            branch 'preprod'
        }
        steps {
            echo "Build started"
            sh "sed -i 's/build_Command/$BUILD_PROD/g' Dockerfile"
            sh "docker build -t erp-admin-pwa-image-prod-$BUILD_NUMBER ."
        }
    }  

    stage('Deploying to preprod server') {
        when {
            branch 'preprod'
        }
        steps {
            echo "Deployment started"
            sh "docker run --name erp-admin-pwa-container-prod-$BUILD_NUMBER -d erp-admin-pwa-image-prod-$BUILD_NUMBER"
            sh "docker cp erp-admin-pwa-container-prod-$BUILD_NUMBER:/app/dist-preprod/. ./dist-preprod/"
            withAWS(region:'ap-south-1',credentials:'School-erp') {
                   sh "aws s3 sync dist-preprod/ s3://erp-admin-pwa-prod/"
                   sh "aws cloudfront create-invalidation --distribution-id E2OZFX1J7ZX7HB --paths '/*'"
               }
            sh "docker rm erp-admin-pwa-container-prod-$BUILD_NUMBER"
            sh "docker rmi erp-admin-pwa-image-prod-$BUILD_NUMBER"   
        }
    }
    
    stage('Clean Workspace') {
        steps {
            cleanWs()
    }
}
        
    }
}