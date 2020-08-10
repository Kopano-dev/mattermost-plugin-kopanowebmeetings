#!/usr/bin/env groovy

pipeline {
	agent {
		docker {
			image 'golang:1.9'
			args '-u 0'
		 }
	}
	environment {
		GLIDE_VERSION = 'v0.13.1'
		GLIDE_HOME = '/tmp/.glide'
		GOBIN = '/usr/local/bin'
		DEBIAN_FRONTEND = 'noninteractive'
	}
	stages {
		stage('Bootstrap') {
			steps {
				echo 'Bootstrapping..'
				sh 'curl -sSL https://github.com/Masterminds/glide/releases/download/$GLIDE_VERSION/glide-$GLIDE_VERSION-linux-amd64.tar.gz | tar -vxz -C /usr/local/bin --strip=1'
				sh 'go get -v github.com/golang/lint/golint'
				sh 'go get -v github.com/tebeka/go2xunit'
				sh 'apt-get update && apt-get install -y libpng-dev'
			}
		}
		stage('Yarn') {
			steps {
				echo 'Installing Yarn..'
				sh 'apt-get install -y apt-transport-https'
				sh 'curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -'
				sh 'echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list'
				sh 'curl -sL https://deb.nodesource.com/setup_8.x | bash -'
				sh 'apt-get install -y yarn'
			}
		}
		stage('Lint') {
			steps {
				echo 'Linting..'
				sh 'golint \$(glide nv) | tee golint.txt || true'
				sh 'go vet \$(glide nv) | tee govet.txt || true'
				sh 'make webapp-lint-checkstyle || true'
			}
		}
		stage('Build') {
			steps {
				echo 'Building..'
				sh 'make'
				sh 'ls ./bin/kwmmmplugind'
			}
		}
		stage('Test') {
			steps {
				echo 'Testing..'
				sh 'make test-xml-short'
			}
		}
		stage('Dist') {
			steps {
				echo 'Dist..'
				sh 'make dist'
			}
		}
	}
	post {
		always {
			archive 'dist/*.tar.gz'
			junit allowEmptyResults: true, testResults: 'test/*.xml'
			recordIssues qualityGates: [[threshold: 100, type: 'TOTAL', unstable: true]], tools: [goVet(pattern: 'govet.txt'), goLint(pattern: 'golint.txt'), esLint(pattern: 'test/tests.eslint.xml')]
			cleanWs()
		}
	}
}
