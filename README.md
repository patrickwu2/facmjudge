# FACM Judge
NTU CSIE Council Freshmen ACM Cup Judge

# Original Project
https://github.com/bobogei81123/adajudge  

https://github.com/tzupengwang/adajudge

https://github.com/qazwsxedcrfvtg14/dsajudge

## Quick Start

1. Setup CentOS 7 Machine

2. Run `install.sh` to install the judge system on CentOS 7	
	- be careful to choose `Semantic UI` settings when install because auto install is bugged

3. go to `dist/script` to add admin user

4. Add problems (hardcode problem 0 not in competition)
	- plz follow the example problem pack to update `tar.gz` file

5. Add all "student" users
	- be ware of some "chinese" words, it may make the css crash

6. Add homework and start the competition

## Debug Tool

```
# Isolate
./isolate --cg --box-id 0 --meta /dev/shm/isolate/META/0 --process --full-env --run -- /usr/bin/env ls -al /usr/bin/ld

./isolate --cg --box-id 0 --meta /dev/shm/isolate/META/0 --process --full-env --run -- /usr/bin/env g++ -O2 -static user.c
```

## Todo List

1. Revise `HomeworkResult` to avoid hardcoded leaderboard

2. Simply nodejs code, including the object saved in mongodb

3. Add user interface to add and delete user

## Issue
Kindly submit any issue you found on github.
