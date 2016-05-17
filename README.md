# Usage

```markdown
URL: https://www.zhihu.com
Data: `Recent questions`, `Question Topic`, `Follow number`, `Question summary`, `Answer ID`, `Author info`, `Vote num`, `Answer time`
```

# Build

```bash
npm install
```

# Config

```
{
    "dbtype": "mysql",
    "dbserver": "localhost",
    "dbport": 3306,
    "dbname": "database_name",
    "dbuser": "database_user",
    "dbpassword": "database_password",
    "start_year": 2016,
    "start_month": 4, //0 for January
    "start_day": 18,
    "kanzhihu_interval": 86400000, //million seconds
    "kanzhihu_sleep": 1000, //million seconds
    "zhihu_sleep": 10000, //million seconds
    "debug": true //true will drop table
}
```

# Run

```bash
npm start
```
# Data

```sql
  `title` varchar(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `topics` varchar(255) DEFAULT NULL,
  `follownum` int(11) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `questionid` varchar(255) DEFAULT NULL,
  `answerid` varchar(255) DEFAULT NULL,
  `authorname` varchar(255) DEFAULT NULL,
  `authorhash` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `vote` int(11) DEFAULT NULL,
```


# Thanks

```url
http://www.kanzhihu.com
```