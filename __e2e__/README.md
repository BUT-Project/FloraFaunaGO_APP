# E2E Testing with Maestro

This directory contains End-to-End tests for the FloraFauna GO app using Maestro.

## Prerequisites

1. **Install Maestro CLI** (already done):
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. **Setup your environment**:
   ```bash
   export PATH="$PATH":"$HOME/.maestro/bin"
   ```

## Running Tests

### For Development (with Expo Go)

1. **Start your Expo development server**:
   ```bash
   npm start
   ```

2. **Open the app in Expo Go** on your device/simulator

3. **Run the E2E tests**:
   ```bash
   # Run all login flow tests
   maestro test __e2e__/your-test.yaml
   
   # Run with verbose output
   maestro test __e2e__/your-test.yaml --debug-output
   
   # Run and generate report
   maestro test __e2e__/your-test.yaml --format html --output report.html
   ```
4. **Chose the device**:
Use the simulator name or UDID
    - For Android, use the device ID from `adb devices`
      - This is usually something like `emulator-5554` for the first emulator
      ```bash
         maestro --device emulator-5554 test __e2e__/your-test.yaml
      ```
    - For iOS, you can find the UDID with `xcrun simctl list devices booted`
      - This is usually something like `E659992A-E70E-4E9B-A2E4-00A3693E572A
      ```bash
      maestro --device E659992A-E70E-4E9B-A2E4-00A3693E572A test __e2e__/your-test.yaml
      ```

## Tips for Writing Tests

1. **Use `optional: true`** for elements that might not always be present
3. **Use descriptive text** rather than IDs when possible (more stable)
4. **Test on real devices** for best results
5. **Use `hideKeyboard`** after text input on mobile

## Troubleshooting
- **Common issues**:
  - **Keyboard dismiss closes app on Android**: this happens because the Google hint and google password manager currently do'nt know how to handle proprely without poluting the app
    - **App not found**: Ensure the appId in your YAML matches your app's bundle identifier
- **Elements not found**: Use `maestro studio` to inspect your app
- **Flaky tests**: Add appropriate waits and optional assertions