# Contributing to the project

First of all, give you a big thanks, if you are reading this document, that means you are willing to collaborate in the project

Please before creating any feature request, or reporting any bug, check the [project Trello board](https://trello.com/lollipopframework)

## Feature request

Create an issue in the Github repository with your request, and the reasons you think it's useful, please note that feature request, if approved will be made after all planned features, and "thumbs up" as the priority

## Bug request

Create a Github issue, describing all the steps required to reproduce the bug, operating system, and node version, when the bug has been confirmed, will be added to the [Trello board](https://trello.com/lollipopframework)

## Code contribution

### Coding rules

Follow the coding rules from tslint, if you are using Visual Studio Code, you should install the *tslint* extension.

The project uses the standard tslint rules, with the following differences:
* Member visibility is always forced, as we don't want developers to having to think on what's the default value
* Protected and private members, **must** start with an underscore, because when debugging, we want to be able to notice, if we are testing internals, or public API
* Public API must be fully documented, **@author** and **@since** are mandatory, if method name is not clear enough, a description is mandatory too