import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Toast } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registration.html',
  styleUrls: ['./registration.css'],
})
export class Registration implements OnInit {
  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private toastr: ToastrService
  ) {
    // Initialize the form inside the constructor
    this.form = this.formBuilder.group(
      {
        fullName: ['', Validators.required], // Matches `Name` in DTO
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail\\.com|outlook\\.com|yahoo\\.com)$'), // Matches EmailDomainValidation
          ],
        ],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern('^9\\d{9}$')], // Matches Phone validation
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
            ), // Matches Password validation
          ],
        ],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required], // Matches `Role` in DTO
        licenseNumber: [''], // Driver-specific fields
        vehicleDetails: [''],
        status: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Watch for changes in the role field to apply driver-specific validations
    this.form.get('role')?.valueChanges.subscribe((role) => {
      this.setDriverValidators(role);
    });
  }

  // Method to set driver-specific validators
  setDriverValidators(role: string): void {
    const licenseNumberControl = this.form.get('licenseNumber');
    const vehicleDetailsControl = this.form.get('vehicleDetails');
    const statusControl = this.form.get('status');

    if (role === 'Driver') {
      licenseNumberControl?.setValidators(Validators.required);
      vehicleDetailsControl?.setValidators(Validators.required);
      statusControl?.setValidators(Validators.required);
    } else {
      licenseNumberControl?.clearValidators();
      vehicleDetailsControl?.clearValidators();
      statusControl?.clearValidators();
      licenseNumberControl?.setValue('');
      vehicleDetailsControl?.setValue('');
      statusControl?.setValue('');
    }

    licenseNumberControl?.updateValueAndValidity();
    vehicleDetailsControl?.updateValueAndValidity();
    statusControl?.updateValueAndValidity();
  }

  // Validator to check if password and confirmPassword match
  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  };

  // Method to handle form submission
  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.valid) {
      // Map frontend fields to backend fields
      const payload = {
        Name: this.form.value.fullName, // Map `fullName` to `Name`
        Email: this.form.value.email,
        Phone: Number(this.form.value.phoneNumber), // Convert `phoneNumber` to a number
        Password: this.form.value.password,
        Role: this.form.value.role,
        LicenseNumber: this.form.value.licenseNumber || null,
        VehicleDetails: this.form.value.vehicleDetails || null,
        Status: this.form.value.status || null,
      };
  
      console.log('Payload:', payload); // Debugging: Log payload
      this.service.createUser(payload).subscribe({
        next: (response) => {
          console.log('API Response:', response); // Debugging: Log API response
          this.toastr.success('User registered successfully!', 'Success');
          this.form.reset();
          this.isSubmitted = false;
        },
        error: (error) => {
          console.error('API Error:', error); // Debugging: Log API error
          if (error.error && typeof error.error === 'object' && error.error.errors) {
            console.error('Validation Errors:', error.error.errors); // Log validation errors
            for (const key in error.error.errors) {
              if (error.error.errors.hasOwnProperty(key)) {
                error.error.errors[key].forEach((msg: string) => {
                  this.toastr.error(msg, 'Validation Error');
                });
              }
            }
          } else if (error.status === 200 || error.status === 201) {
            // Handle cases where the backend returns a success response with an error status
            this.toastr.success('User registered successfully!', 'Success');
            this.form.reset();
            this.isSubmitted = false;
          } else {
            this.toastr.error('Failed to register user. Please try again.', 'Error');
          }
        },
      });
    } else {
      this.toastr.error(
        'Form is invalid. Please check the fields and try again.',
        'Error'
      );
    }
  }
  
  // Helper method to check if a control has an error to display
  hasDisplayError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (Boolean(control?.touched) || this.isSubmitted)
    );
  }
}