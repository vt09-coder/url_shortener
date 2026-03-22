## url_shortener
# This app takes an url and shorten the url which you can use.

The features of the app are -
1. Takes the original url and uses Base62 algorithm to shorten the url.
2. Save the click count of each url in the db, which can be used for analytics.
3. Uses redis for faster access and also to reduce load on the db.

I build this app to learn how db works, how to write a good schema, how to use redis for rate limiting and how to upload code from local machine onto Github.

# How to run the app
1. Clone the app down to your local machine.
2. Run npm install in the terminal.
3. Install prisma and prisma client from the terminal.
4. Create a db in postgresql.
5. Make a .env file and write the db and redis password (Dont share the env file with others).
6. Connect the db to prisma client.
7. Install the redis from the terminal.
8. Connect your redis to the project.
9. Run cd_(project name) in the terminal.
10. Run npm run dev in the terminal.

# Contribution rules
I am really thankfull to all who view this project and found it helpfull. If you wanna contribute, you can fork the project and do your improvements. Again, thanks ro all!
