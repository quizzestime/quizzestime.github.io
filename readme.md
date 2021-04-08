# Quiz Time

System for creating, managing and completing tests with free access.

## Functionality

-   User registration
-   Ability to view and solve other user's tests
-   Various categories
-   Ability to filter by category and search by title
-   Keeping statistic for each user and test
-   Interactive test editor
-   Fluid UX

## Technologies

-   HTML, CSS, Vanilla JavaScript
-   Lit-html, Page
-   GitHub Pages, Back4app

## Views (Pages)

-   **Landing Page**
-   **Login/Register** - registration with email, username and password.
-   **Quiz Browser** - list of tests and option to search by title and filter by category.
-   **Quiz Details** - additional description, test statistics, information about the author and option to start the test.
-   **Quiz Contest Mode** - answering questions, each question have separate view, option to skip questions, opportunity to restart the test.
-   **Quiz Results** - summary of the results, option to review the wrong answers.
-   **Profile Page** - information for created and completed tests.
-   **Quiz Editor** - integrated editor for tests, questions and answers.

## Implementation

### Data structure

#### Collections:

-   Sessions
-   Users

```javascript
{
    email: String,
    username: String,
    password: String
}
```

-   Quizzes

```javascript
{
    title: String,
    category: String,
    questionCount: Number
}
```

-   Questions

```javascript
{
    text: String,
    answers: Array<String>,
    answerIndex: Number,
    quiz:  Pointer<Quiz>
}
```

-   Solutions

```javascript
{
    quiz: Pointer<Quiz>,
    correctIndex: Number
}
```

#### Access control

-   Guests can register, view the quiz catalog, quiz's details and users profiles.
-   Registered users can complete quizzes, view their results, create and edit quizzes.
-   Only the creator of a quiz can edit and delete it.
-   Each registered user can solve other user's quizzes.
