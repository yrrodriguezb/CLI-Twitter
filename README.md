## Twine

CLI Twitter


### Comandos de ayuda

1.  twine
        
    ``` bash
    twine --help

    Usage: twine [options] [command]

    Options:
    -V, --version   output the version number
    -h, --help      display help for command

    Commands:
    configure       Configure Twitter-related credentials
    lookup          lookup things on Twitter
    help [command]  display help for command 
    ```

2.  configure

    ``` bash
    twine configure --help
    
    Usage: twine-configure [options] [command]

    Options:
    -V, --version   output the version number
    -h, --help      display help for command

    Commands:
    consumer        Add a Twitter API key and secret
    account         Authorize access to a Twitter account
    help [command]  display help for command
    ```

    ``` bash  
    twine configure consumer

    ? Enter your Twitter API key: __KEY__
    ? Enter your Twitter API secret: [input is hidden] __SECRET__
    ```

    ``` bash  
    twine configure account

    ? Press enter to open Twitter in your default browser to authorize access

    # Authorize
    ? Enter the PIN provided by Twitter [input is hidden] __PIN_TWITTER__

    Message: Account "__USER__" successfully added
    ```

3. lookup

    
    ``` bash
    twine lookup --help

    Usage: twine-lookup [options] [command]

    Options:
    -V, --version         output the version number
    -h, --help            display help for command

    Commands:
    users [screen-names]  Find users by their screen name
    statuses [ids]        Find statuses (tweets) by their ID
    help [command]        display help for command
    ```

    ``` bash
    twine lookup users __USER__

    cat __FILE_USERS_ | twine lookup users

    twine lookup statuses __ID_STATUS__

    cat __FILE_STATUSES_ | twine lookup statuses
    ```