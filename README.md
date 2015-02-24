# ntt

part of my bachelor thesis which is documented here: [gerhardbliedung.com/ntt](http://www.gerhardbliedung.com)


to run:
``` 
npm install
```
then
```
sails lift
```

### '/'

- shows the main interface, alloe microphone and camera access and start talking
- voice then gets transcribed by google, send to wit.ai for classification and then back to the interface
- hit space for debugging

### '/camera'

- shows the face tracking process
- does not influence the main interface as is, it was more used to track the general reaction of the visitors over time


### Known errors

- If you ask "How are you today" for the first time, the app crashes. (maybe use [forever](https://www.npmjs.com/package/forever) when you check it out)
- some wolfram requests crash, when multiple options are available (pod didyoumeans)
- The deadline and the fact that it was an exhibition did not work wonders for code structure and logic :/
 

Have fun!
