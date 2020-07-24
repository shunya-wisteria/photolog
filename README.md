# photolog-front

![PhotoLog Capture1](https://firebasestorage.googleapis.com/v0/b/photologv2.appspot.com/o/photolog%2Fasset%2Fpl_capture01.jpg?alt=media&token=6f836bad-a35c-4a91-910e-9357705b6ddd "Management Portal Page")

![PhotoLog Capture2](https://firebasestorage.googleapis.com/v0/b/photologv2.appspot.com/o/photolog%2Fasset%2Fpl_capture02.jpg?alt=media&token=30325b9b-a236-432f-9449-b54a96d09f91 "Edit Page")

## At first
This application needs to external services describe following.
- Google Map API
- Firebase Authentication
- Firebase Cloud FireStore
- Firebase Storage

The configurations of them are mentioned below section.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

---

## Configuration Settings for Environment
This application needs to Google Map API and Firebase.  
We show how to set these credential informations to this application.

1. Please create following env files at project root directory.
   - .env.development
   - .env.production
2. Write your Google Map API Key and Firebase Credentials to env files(Refer sample).
    ```
    NODE_ENV=production
    * if development env, please replace "development".

    VUE_APP_MAP_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

    VUE_APP_FIREBASE_APIKEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    VUE_APP_FIREBASE_AUTHDOMAIN="xxxxxxxxxxxxxxxxx.firebaseapp.com"
    VUE_APP_FIREBASE_DATABASEURL="https://xxxxxxxxxxxxxx.firebaseio.com"
    VUE_APP_FIREBASE_PROJECTID="xxxxxxxxxxxxxx"
    VUE_APP_FIREBASE_STORAGEBUCKET="xxxxxxxxxxxxxx.appspot.com"
    VUE_APP_FIREBASE_MESSAGINGSENDERID="xxxxxxxxxxxxxx"
    VUE_APP_FIREBASE_APPID="xxxxxxxxxxxxxxxxxxxxxxxxx"
    ```
3. Also, write language key like following.
    ```
    VUE_APP_LOCALE="en"
    * if use Japanese env, please replace "ja"
    ```
4. Reboot application service.

## Data Model Structure for Firebase Cloud Firestore
This application uses Firebase Cloud Firestore to store user entries.  
Data Model Structure is following.

- Root Collection : PhotoLog (Fixed Value)
  - Documents : UID which is created by Firebase Authentication is set as Document id.  
This stores one sub collection named "Log".
      - Sub Collection : Log (Fixed Value)
        - Documents : Id is Unique value created by firebase standard function.  
This entry is express as one pos entry. Field variant is following.
            - name : Entry Name
            - desc : Description for Entry
            - photo : URL of Photo
            - pos
              - _lat : Latitude of Position
              - _lng : Longitude of Position
            - refurl : Reference Page URL

The security rule of Cloud Firestore is following. This rule expresses that anyone can read, only owner of entry can write.
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /PhotoLog/{userID}/{document=**}{
    	allow read :if true;
      allow write :if request.auth.uid == userID;
    }  
  }
}
```

## Storage Structure for Firebase Storage
This application uses Firebase Storage to store photo ralated with entries.  
Structure of Storage is following.
- Root/ : photolog(Fixed Value)
  - UID/ : UID is created by Firebase Authentication

The security rule of Firebase Storage is following. This rule expresses that anyone can read, only owner of user directory can write.
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    match /photolog/{allPaths=**} {
    	allow read: if true
    }
    
    match /photolog/{userID}/{id}{
      allow write : if request.resource.size < 20 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*')
                   && request.auth.uid == userID;
    }
    
  }
}

```