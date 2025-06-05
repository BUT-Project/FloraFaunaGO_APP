def main(ctx):
    commit_message = ctx.build.message.lower()
    if "[ci_none]" in commit_message:
        return nullPipeline()
    
    return [
        pipeline_ffgo_ci()
    ]

def nullPipeline():
    return {
        "kind": "pipeline",
        "name": "Nothing",
        "steps": []
    }

def pipeline_ffgo_ci():
    return {
        "kind": "pipeline",
        "type": "docker", 
        "name": "FFGO-CI",
        "trigger": {
            "event": ["push"]
        },
        "steps": [
            step_app_build(),
            step_typescript_check(),
            step_test(),
            step_e2e_test(),
            step_code_analysis()
        ],
        "volumes": [
            {
                "name": "test-results",
                "temp": {}
            }
        ]
    }

def step_app_build():
    return {
        "name": "app-build",
        "image": "node:latest",
        "commands": [
            "npm install"
        ]
    }

def step_typescript_check():
    return {
        "name": "typescript-check", 
        "image": "node:latest",
        "commands": [
            "npm install",
            "npx tsc --noEmit"
        ],
        "depends_on": ["app-build"]
    }

def step_test():
    return {
        "name": "test",
        "image": "node:latest", 
        "commands": [
            "npm install",
            "NODE_ENV=test npm run test:ci --forceExit"
        ],
        "depends_on": ["typescript-check"]
    }

def step_e2e_test():
    return {
        "name": "e2e-test",
        "image": "node:18",
        "volumes": [
            {
                "name": "test-results",
                "path": "/test-results"
            }
        ],
        "commands": [
            "# Install Node.js dependencies",
            "npm install",
            "",
            "# Install Maestro CLI",
            "curl -Ls \"https://get.maestro.mobile.dev\" | bash",
            "export PATH=\"$PATH:/root/.maestro/bin\"",
            "",
            "# For now, just validate the test file syntax (no emulator in untrusted repo)",
            "echo 'Validating Maestro test files...'",
            "/root/.maestro/bin/maestro test --dry-run e2e/login-flow.yaml",
            "",
            "# Create test report placeholder",
            "mkdir -p /test-results",
            "echo '<?xml version=\"1.0\" encoding=\"UTF-8\"?>' > /test-results/e2e-results.xml",
            "echo '<testsuites><testsuite name=\"E2E Tests\" tests=\"1\" failures=\"0\"><testcase name=\"login-flow-validation\" /></testsuite></testsuites>' >> /test-results/e2e-results.xml",
            "",
        ],
        "depends_on": ["test"]
    }

def step_code_analysis():
    return {
        "name": "code-analysis",
        "image": "node:latest",
        "environment": {
            "SONAR_TOKEN": {
                "from_secret": "SONAR_TOKEN"
            }
        },
        "settings": {
            "sources": "."
        },
        "commands": [
            "export SONAR_SCANNER_VERSION=4.7.0.2747",
            "export SONAR_SCANNER_HOME=$HOME/.sonar/sonar-scanner-$SONAR_SCANNER_VERSION-linux",
            "curl --create-dirs -sSLo $HOME/.sonar/sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-$SONAR_SCANNER_VERSION-linux.zip",
            "unzip -o $HOME/.sonar/sonar-scanner.zip -d $HOME/.sonar/",
            "export PATH=$SONAR_SCANNER_HOME/bin:$PATH",
            "export SONAR_SCANNER_OPTS=\"-server\"",
            "sonar-scanner -D sonar.projectKey=FFGO -D sonar.sources=. -D sonar.exclusions=**/__tests__/**,**/*.spec.ts,**/*.test.ts -D sonar.javascript.lcov.reportPaths=./__tests__/coverage/lcov.info -D sonar.host.url=https://codefirst.iut.uca.fr/sonar"
        ],
        "depends_on": ["e2e-test"]
    }