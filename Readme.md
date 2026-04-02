## Bank Transaction Web

### link- ***https://bank-55bs.onrender.com***

### Register - 
* *ENDPOINTS* - *`/api/auth/register`*
* User *`send`* the $data$
* checking the $data$ is already *`exists`* in database or not
* if *`exists`* return that *`user`* already *`exists`*
* if not then saved that data into *`database`*
* *`Password`* should be *`hashed`* 
* after saving the *`data`* into *`database`* then Generate the *`token`*
* After Generating the *`token`* save in *`cookies`*
* After all this return final *`res`* that user created *`successfully`*

### Login
* *ENDPOINTS* - *`/api/auth/login`*
* User send data to *`server`*
* find that *`email`* is *`exists`* or not
* if not *`exists`* return *`email`* or *`password`* is incorrect
* if *`exists`* then *`comapare`* the *`password`* which is saved in database with *`current`* one
* after that *`generate`* the *`tokens`*
* saved that *`token`* into *`cookies`*
* return final *`response`* that data is *~verifed~*