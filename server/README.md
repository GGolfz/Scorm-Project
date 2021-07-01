# Server

Run DB 
docker run -e POSTGRES_USER=scorm_user -e POSTGRES_PASSWORD=dADKHgj86jQoRoff7xwC4TZ -e POSTGRES_DB=scorm_db -e "POSTGRES_HOST_AUTH_METHOD=trust" -p "5432:5432" postgres:12