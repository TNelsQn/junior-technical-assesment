# **Junior Technical Assessment - Kore Developers**  

 This project invovled the following tasks:

- refactoring the card component out of the main app and into its own component
- creating error messages to display to the user during delete/update of a card
- update the validation errors to improve user feedback
- complete missing tests

I will detail my approach to these problems step by step

## **refactoring the card component out of the main app and into its own component**  

- created a new component called card that takes the inputs of edit and delete as well as the product it is editing
- added error status effect to the card that creates a red border on error.

### **creating error messages to display to the user during delete/update of a card**  

- Added a CardError class that contains an erroring id and a custom error message.
- created an error handler that han set the value of these fields for a specific card.
- used these fields in the app component to display an error message and highlight the erroring card in a red box.

### **update the validation errors to improve user feedback**  

- improve the validation errors to now give custom error messages based on a number of factors including both min and max length, required and special characters.
- this allows the user to better understand why the field failed to submit so they can fix the issues.

### **complete missing tests**  

Completed the missing tests including:

- testing that the custom errors messages for loading, updating and deleting are being set.
- added tests the check if the emit event on the cancel loan is being called and if the form does reset.
