## Build Simple AB for Android
Our builds so far have only been for the browser, which is perfect for prototyping and testing.  
Now we want to try it out on an android device.  

#### Prerequisite
Download the [Android SDK and build tools](https://developer.android.com/studio/index.html).  
We only need the command line tools (bottom of the page).

#### Build a release package
First add the android platform with:

```bash
$ ionic platform add android
``` 

Next build our android release package with:

```bash
$ ionic build android --release
```

The build will create `android-release-unsigned.apk` in the `platforms/android/build/outputs/apk` folder.  Before we can install it on our device or upload it to the Play Store, there are couple of things to do.

#### Prepare the package
The package needs to be signed with your private key and 'zip align it'.  
For details, see [Ionic: 6. Publishing your app](https://ionicframework.com/docs/guide/publishing.html)  
My signed and zip-aligned SimpleAB can now be <a href="SimpleAB.apk" download>Installed on Android</a>

### Install the package
