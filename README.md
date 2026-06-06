# Quiz App Quasar

A Quasar Project

### Install the dependencies

```bash
npm install
```

### Start the app in development mode 

```bash
quasar dev
#or to run electron app
quasar dev -m electron
```

### Build the app using electron-builder and nsis
```bash
quasar build
#or to build electron app
quasar build -m electron
```

# How to use the app

## Settings

### Team settings

- add new teams by clicking ADD NEW TEAM button
- remove teams by clicking right -> REMOVE TEAM
- double click on team name or team color to edit
- you can use the arrow buttons to change the order of the teams
- don't forget to save the changes!

### Question settings

- add new question category by clicking ADD NEW CATEGORY button
- remove category by clicking right -> REMOVE CATEGORY
- single click on category expands it, showing the questions
- adding and removing questions works the same
- you can change the order of both categories and questions using arrow buttons
- don't forget to save the changes!

Global game settings are bundled with question settings:
- change the displayed game name and answer time by double clicking
- you can reset the game progress by clicking the RESET GAME PROGRESS button

> [!NOTE]
> Resetting progress is irreversible, but doesn't affect teams and questions edited in the settings

## Game mode

### Clicking on the element with displayed question points opens up the question dialog:

- Start the timer by clicking the START button
- Update the answer status by clicking either CORRECT or INCORRECT buttons
- Steal the question using STEAL button (for now each team has unlimited steals, limit will be added in the future)

### Game summary

Once all the questions have been answered, you can click the SHOW RESULTS button to check the results.

# Known issues

- When using node ^26, electron tends to break on the building step.

- Windows defender often removes electron.exe file, try disabling it or adding folder as an exception.
