import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // Placeholder methods for social login
  continueWithGoogle() {
    console.log('Continue with Google');
    // TODO: implement OAuth
  }

  continueWithMicrosoft() {
    console.log('Continue with Microsoft');
  }

  continueWithApple() {
    console.log('Continue with Apple');
  }

  signInWithEmail() {
    console.log('Sign in with email');
    // TODO: navigate to email form or show modal
  }
}
