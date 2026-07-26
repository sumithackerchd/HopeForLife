# Requirements Document

## 1. Application Overview

### 1.1 Application Name
HopeForLife

### 1.2 Application Description
A medical crowdfunding platform dedicated to helping a single child with cancer. The platform enables donors to contribute funds, view medical progress, access treatment information, and receive updates. Administrators manage donations, medical reports, hospital information, and platform content.

## 2. Users and Usage Scenarios

### 2.1 Target Users
- **Donors**: Individuals who wish to contribute financially to support the child's medical treatment
- **Administrators**: Platform managers responsible for content updates, donation management, and system configuration
- **General Visitors**: Users browsing information about the child's medical condition and treatment progress

### 2.2 Core Usage Scenarios
- Donors learn about the child's medical story and make donations
- Administrators upload medical reports, treatment updates, and manage donation records
- Visitors access treatment timelines, hospital information, and recent updates
- Users subscribe to newsletters for ongoing updates

## 3. Page Structure and Functionality

### 3.1 Page Hierarchy

```
HopeForLife Platform
├── Public Pages
│   ├── Landing Page
│   ├── About
│   ├── Medical Story
│   ├── Treatment Timeline
│   ├── Medical Reports
│   ├── Hospital Information
│   ├── Donation Page
│   ├── Updates
│   ├── FAQ
│   ├── Contact
│   ├── Blog
│   │   ├── Blog List
│   │   └── Blog Detail
│   ├── Privacy Policy
│   ├── Terms of Service
│   ├── Refund Policy
│   ├── 404 Error Page
│   └── 500 Error Page
├── Authentication Pages
│   ├── Login
│   ├── Register
│   ├── Verify Email
│   ├── Forgot Password
│   └── Reset Password
├── User Dashboard
│   ├── Dashboard Home
│   ├── Donation History
│   ├── Profile
│   └── Settings
└── Admin Panel
    ├── Dashboard
    ├── Campaign Management
    │   ├── Campaign List
    │   ├── Create Campaign
    │   ├── Edit Campaign
    │   └── Campaign Detail
    ├── Donation Management
    ├── User Management
    ├── Reports
    └── Settings
```

### 3.2 Public Pages

#### 3.2.1 Landing Page
- Display hero section with child's photo and compelling headline
- Show fundraising progress bar with raised amount, goal amount, and remaining amount
- Present child's medical story summary
- Display reasons why donations are needed
- Show medical treatment timeline
- List recent donors with names, amounts, and messages
- Display testimonials from supporters
- Show hospital details and treatment information
- Present latest updates from administrators
- Include FAQ section
- Provide call-to-action buttons for donation
- Offer newsletter subscription form
- Display footer with links to all pages

#### 3.2.2 About
- Provide detailed background about the platform
- Explain mission and purpose
- Display contact information

#### 3.2.3 Medical Story
- Present comprehensive narrative of child's medical condition
- Include diagnosis details
- Explain treatment requirements
- Display child's photos

#### 3.2.4 Treatment Timeline
- Show chronological list of medical events
- Display dates, descriptions, and outcomes for each milestone
- Indicate current treatment stage

#### 3.2.5 Medical Reports
- List all uploaded medical reports
- Display report titles, upload dates, and file types
- Provide preview functionality for PDF and image files
- Enable zoom and download options
- Show verified badge for authenticated reports

#### 3.2.6 Hospital Information
- Display hospital name, address, and contact details
- Show treating doctor information
- Present treatment cost estimate
- Display hospital images
- Provide location map

#### 3.2.7 Donation Page
- Display fundraising progress summary
- Provide quick donation amount options: ₹100, ₹500, ₹1000, ₹2500, ₹5000, ₹10000
- Allow custom donation amount input
- Offer anonymous donation option
- Enable donors to leave dedicated messages
- Support multiple currency selection
- Process payment and display success, failure, or pending status
- Generate and allow download of donation receipt

#### 3.2.8 Updates
- List all updates posted by administrators
- Display update titles, dates, and content
- Show most recent updates first

#### 3.2.9 FAQ
- Display frequently asked questions with answers
- Organize by categories
- Provide search functionality

#### 3.2.10 Contact
- Display contact form with fields for name, email, subject, and message
- Show contact information including email and phone
- Provide social media links

#### 3.2.11 Blog
- **Blog List**: Display all blog posts with featured images, titles, excerpts, publication dates, categories, and tags
- **Blog Detail**: Show complete blog post content with featured image, author information, publication date, categories, tags, and related posts
- Support search functionality across blog posts
- Enable filtering by categories and tags

#### 3.2.12 Privacy Policy
- Display complete privacy policy text
- Explain data collection, usage, and protection practices

#### 3.2.13 Terms of Service
- Display terms and conditions for platform usage
- Explain user rights and responsibilities

#### 3.2.14 Refund Policy
- Display refund policy details
- Explain conditions and process for refund requests

#### 3.2.15 404 Error Page
- Display user-friendly message for page not found
- Provide navigation links to return to main pages

#### 3.2.16 500 Error Page
- Display user-friendly message for server errors
- Provide contact information for support

### 3.3 Authentication Pages

#### 3.3.1 Login
- Provide email and password input fields
- Include login button
- Offer forgot password link
- Provide link to registration page

#### 3.3.2 Register
- Provide input fields for name, email, and password
- Include password confirmation field
- Display registration button
- Send email verification link upon successful registration

#### 3.3.3 Verify Email
- Display verification status message
- Confirm email verification upon clicking link from email
- Redirect to login page after successful verification

#### 3.3.4 Forgot Password
- Provide email input field
- Send password reset link to registered email
- Display confirmation message

#### 3.3.5 Reset Password
- Provide new password and confirmation input fields
- Validate reset token from email link
- Update password and redirect to login page

### 3.4 User Dashboard

#### 3.4.1 Dashboard Home
- Display user profile summary
- Show total donation amount contributed
- List recent donation activities

#### 3.4.2 Donation History
- Display complete list of user's donations
- Show donation dates, amounts, payment status, and messages
- Provide receipt download option for each donation

#### 3.4.3 Profile
- Display user information including name, email, and profile photo
- Allow editing of profile details

#### 3.4.4 Settings
- Enable dark mode and light mode toggle
- Provide language selection option
- Allow newsletter subscription management
- Enable password change functionality

### 3.5 Admin Panel

#### 3.5.1 Dashboard
- Display real-time statistics retrieved from Supabase:
  + Total campaign count
  + Total donation count
  + Active campaigns count
  + Total raised amount
- Show live charts visualizing donation trends over time
- List recent donations with donor names, amounts, dates, and campaign names
- Display campaign performance metrics

#### 3.5.2 Campaign Management

##### 3.5.2.1 Campaign List
- Display all campaigns in table format with columns: Title, Beneficiary, Goal Amount, Current Raised Amount, Status, Created Date
- Provide search functionality by title, beneficiary, or slug
- Enable filtering by status: Published, Draft, Archived
- Show action buttons for each campaign: Edit, Delete, Publish/Unpublish, Archive
- Display campaign count summary by status

##### 3.5.2.2 Create Campaign
- Provide input fields for campaign data:
  + Title
  + Slug (auto-generated from title, editable)
  + Beneficiary (child's name)
  + Hospital (name and details)
  + Goal Amount
  + Current Raised Amount (default to 0)
  + Category (dropdown selection)
  + Story (rich text editor)
  + Images (multiple image upload)
  + Cover Image (single image upload)
  + Medical Reports (multiple file upload)
  + Videos (video URL input or file upload)
  + SEO fields: Meta Title, Meta Description, Keywords
  + Status (dropdown: Draft, Published)
- Validate required fields before submission
- Save campaign data to Supabase upon submission
- Redirect to Campaign List after successful creation

##### 3.5.2.3 Edit Campaign
- Load existing campaign data from Supabase
- Display all campaign fields with current values
- Allow modification of all fields
- Update campaign data in Supabase upon submission
- Redirect to Campaign List after successful update

##### 3.5.2.4 Campaign Detail
- Display complete campaign information
- Show all campaign fields in read-only format
- Provide action buttons: Edit, Delete, Publish/Unpublish, Archive

##### 3.5.2.5 Campaign Actions
- **Publish/Unpublish**: Toggle campaign status between Published and Draft, update status in Supabase
- **Delete**: Remove campaign record from Supabase after confirmation
- **Archive**: Change campaign status to Archived, update status in Supabase

#### 3.5.3 Donation Management
- Display all donations in table format with columns: Donor Name, Amount, Campaign, Date, Payment Status, Gateway, Transaction ID
- Provide search functionality by donor name, transaction ID, or campaign name
- Enable filtering by:
  + Payment Status: Success, Pending, Failed
  + Gateway: Payment provider name
  + Date Range: Start date and end date
- Provide export functionality:
  + Export to CSV format
  + Export to Excel format
- Retrieve all donation data from Supabase
- Display total donation count and total amount raised

#### 3.5.4 User Management
- Display all registered users in table format with columns: Name, Email, Registration Date, Role, Status
- Provide search functionality by name or email
- Enable user actions:
  + Ban User: Change user status to banned, update status in Supabase
  + Promote to Admin: Change user role to admin, update role in Supabase
- Retrieve all user data from Supabase
- Display total user count

#### 3.5.5 Reports
- Generate and display platform reports:
  + Donation summary by date range
  + Campaign performance report
  + User registration trends
  + Payment gateway performance
- Provide export functionality for reports
- Retrieve report data from Supabase

#### 3.5.6 Settings
- Allow configuration of platform settings:
  + Site name and tagline
  + Contact information
  + Social media links
  + Payment gateway credentials
  + SMTP server details
  + SEO settings
- Save all settings to Supabase
- Load current settings from Supabase on page load

## 4. Business Rules and Logic

### 4.1 Donation Processing
- Donations are processed through configured payment gateway
- Upon successful payment, donation record is created with donor information, amount, payment status, and timestamp
- Donor receives thank you email with donation receipt
- Administrator receives notification email about new donation
- Fundraising progress bar updates automatically based on total donations received

### 4.2 Anonymous Donations
- When anonymous option is selected, donor name is not displayed publicly
- Donation amount and message are still visible
- Donor information is stored in backend for receipt and record purposes

### 4.3 Email Verification
- Upon registration, verification email is sent to user's email address
- User must click verification link to activate account
- Unverified users cannot access user dashboard

### 4.4 Password Reset
- Password reset link is valid for 1 hour
- Link can only be used once
- After successful password reset, all existing sessions are invalidated

### 4.5 User Roles and Permissions
- **Donor Role**: Can make donations, view donation history, manage profile
- **Admin Role**: Full access to admin panel and all management functions
- Role assignment is performed by existing administrators

### 4.6 Medical Reports Verification
- Administrators can mark medical reports as verified
- Verified reports display verified badge
- Only administrators can upload and manage medical reports

### 4.7 Newsletter Subscription
- Users can subscribe to newsletter from landing page footer
- Subscribers receive email updates when administrators send newsletters
- Users can unsubscribe via link in newsletter emails

### 4.8 Search Functionality
- Global search covers medical reports, updates, and blog posts
- Search results display matching items with titles and excerpts
- Search is case-insensitive

### 4.9 Dark Mode and Light Mode
- Users can toggle between dark mode and light mode
- Preference is saved and persists across sessions
- Default mode is light mode

### 4.10 Multi-Currency Support
- Donation page supports multiple currencies
- Currency conversion is handled by payment gateway
- Donation amounts are stored in platform's base currency

### 4.11 Recurring Donation
- Platform is ready to support recurring donations
- Recurring donation setup requires payment gateway configuration

### 4.12 Campaign Status Management
- **Draft**: Campaign is not visible to public, only accessible by administrators
- **Published**: Campaign is visible to public and accepts donations
- **Archived**: Campaign is no longer active, not visible to public, donations disabled
- Status changes are immediately reflected in Supabase

### 4.13 Campaign Slug Generation
- Slug is auto-generated from campaign title upon creation
- Slug is URL-friendly (lowercase, hyphens instead of spaces)
- Slug must be unique across all campaigns
- Administrators can manually edit slug before saving

### 4.14 Current Raised Amount Update
- Current Raised Amount is automatically calculated from total donations linked to campaign
- Manual updates to Current Raised Amount are allowed for administrative corrections
- Amount is updated in real-time when new donations are received

### 4.15 Admin Panel Data Integrity
- All data displayed in Admin Panel is retrieved from Supabase in real-time
- All CRUD operations (Create, Read, Update, Delete) are performed directly on Supabase
- No placeholder data or fake numbers are used
- Dashboard statistics are calculated from actual database records

### 4.16 User Ban and Role Promotion
- Banned users cannot log in to platform
- Promoted users gain full admin access immediately
- Role and status changes are logged for audit purposes

## 5. Exceptions and Edge Cases

| Scenario | Handling |
|----------|----------|
| Payment gateway failure | Display error message, allow retry, notify administrator |
| Email sending failure | Log error, retry sending, notify administrator if persistent |
| Invalid email verification link | Display error message, provide option to resend verification email |
| Expired password reset link | Display error message, provide option to request new reset link |
| Duplicate email registration | Display error message indicating email already registered |
| Unauthorized access to admin panel | Redirect to login page, display access denied message |
| File upload exceeds size limit | Display error message with size limit information |
| Invalid file format for medical reports | Display error message with supported formats |
| Network timeout during donation | Display pending status, provide instructions to check email for confirmation |
| Search with no results | Display message indicating no matching results found |
| Unsubscribe from newsletter with invalid token | Display error message, provide contact information for support |
| Duplicate campaign slug | Display error message, suggest alternative slug |
| Delete campaign with existing donations | Display confirmation warning, allow deletion with option to archive instead |
| Supabase connection failure | Display error message, retry connection, log error for administrator |
| Export with no data | Display message indicating no data available for export |
| Ban user who is currently logged in | Invalidate user session immediately, redirect to login page |
| Promote user to admin with insufficient permissions | Display error message, require super admin approval |

## 6. Acceptance Criteria

1. Visitor accesses landing page and views child's medical story, fundraising progress, and recent donors
2. Visitor navigates to donation page, selects donation amount, completes payment, and receives donation receipt
3. Donor registers account, verifies email, logs in, and views donation history in user dashboard
4. Administrator logs into admin panel, creates new campaign with all required fields, publishes campaign, and verifies campaign appears on public pages
5. Administrator views dashboard with real-time statistics from Supabase, accesses donation management, filters donations by payment status, and exports donation data to CSV

## 7. Out of Scope for Current Release

- Mobile native applications for iOS and Android
- Multi-language support beyond language selection placeholder
- Real-time chat or messaging between donors and administrators
- Social media login integration
- Donor leaderboard or gamification features
- Automated tax receipt generation with tax authority compliance
- Integration with third-party analytics platforms beyond configuration readiness
- Automated fraud detection system
- Donor matching or corporate sponsorship programs
- Peer-to-peer fundraising campaigns
- Volunteer management system
- Event management for fundraising events
- Merchandise store for fundraising products
- Integration with accounting software
- Multi-campaign support for multiple children or causes
- Advanced campaign analytics and A/B testing
- Automated campaign status transitions based on goal achievement
- Campaign duplication or template functionality
- Bulk campaign operations
- Campaign approval workflow for multi-admin environments