// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_ENDPOINT: 'http://54.245.128.14:3000',
  WEB_ENDPOINT: 'http://localhost:4400',
  APP_NAME: 'Date & Meet',
  DEFAULT_RECORDS_LIMIT: 6,
  DEFAULT_PAGES_PAGINATION: 5, //Defines the maximum number of page links to display
  DEFAULT_PAGE_LIMIT_OPTIONS: [
    { value: 6 },
    { value: 12 },
    { value: 24 },
    { value: 48 },
    { value: 96 },
  ],
  DEFAULT_PROFILE: 'assets/img/defaults/default-user.png',
  FIREBASE_CONFIG:{
    apiKey: "AIzaSyDcln-AfQuI0C1TzXAU37yM4wXaJUkfe20",
    authDomain: "dating-app-def07.firebaseapp.com",
    databaseURL: "https://dating-app-def07.firebaseio.com",
    projectId: "dating-app-def07",
    storageBucket: "",
    messagingSenderId: "347068593258",
    appId: "1:347068593258:web:bb3223d730b5bd55"
 },
 MESSAGES:{
  //LOGOUT_SUCCESS:'Loggedout successfully.',
  //CAR_STATUS_CHANGED:'Status has been changed successfully.',
  LOGIN_SUCCESS: 'Authorised & Loggedin successfully.',
  LOGOUT_SUCCESS: 'Logout successfully.',
  FORGOT_PASSWORD_SUCCESS: 'Forget password instruction has been sent to your email',
  RESEND_VERIFICATION_SUCCESS: 'The verification link has been resent to your email successfully. Please Check your email.',
  VERIFICATION_PENDING: 'Verification Code has been sent to your mobile number. Please verify your account.',
  SIGNUP_SUCCESS: 'Congratulations!! Your account has been verified successfully and is ready to use.',
  SUCCESS_ADD: 'has been added successfully.',
  SUCCESS_EDIT: 'has been updated successfully.',
  SUCCESS_DELETE: 'has been deleted successfully',
  LOGIN_FAILURE: 'Email/password do not match.',
  EMAIL_EXIST: 'Email Already exist! Please try another one.',
  EMAIL_NOT_EXIST: 'Email does not exist.',
  ERROR_TEXT_LOADER: 'Oops got error...',
  UPLOAD_SUCCESS: 'Has been uploaded successfully.',
  UPLOAD_ERROR: 'We got some error in upload.',
  MAIL_SENT: 'Mail has been sent. Please check your inbox.',
  OTP_RESEND: 'Verification Code has been sent to your mobile number.',
  OTP_FAILED_RESEND: 'Failed to send Verification Code to your mobile number. Please try again later.',
  GENERATING_OTP: 'Generating Verification Code...',
  FAILED_TO_REGISTER: 'Registration failed for some unknown reason. Please try again later.',
  SAVING_INFO_LOADER_TEXT: 'Saving info, Please wait...',
  SUCCESS_REGISTER: 'Thank You for Registering!',
  SYSTEM_ERROR: 'System got failure for some unknown reason. Please try again later.',
  CHECKING_INFO_LOADER_TEXT: 'Checking info, Please wait...',
  PLS_WAIT_TEXT: 'Please wait...',
  VERIFICATION_FORGOT_PASSWORD: 'Verification Code has been sent to your registered mobile number. Please verify your account.',
  PASSWORD_RESET_SUCCESS: 'Your password has been updated successfully. Please login.',
  FETCHING_RECORDS: 'Fetching Data...',
  RECORD_DELETED: 'Record has been deleted successfully.',
  DEALERSHIP_ADDED: 'Dealership has been added successfully.',
  DEALERSHIP_UPDATED: 'Dealership has been updated successfully.',
  DELETING_RECORD: 'Deleting Record...',//new
  CONTACT_ADDED: 'Legal Contact has been added successfully.',
  NO_RECORDS_FOUND: 'No Records Found.',
  CONTACT_REQUEST_SEND: 'Thanks! Email has been send successfully and our support team will contact you soon.',
  PROFILE_UPDATE: 'Profile has been updated successfully.',
  INVALID_TOKEN: 'We received a invalid token. Please request again to recover your password.'
}
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
