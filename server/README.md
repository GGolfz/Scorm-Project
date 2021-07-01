# Server

Run DB 
docker run -e POSTGRES_USER=scorm_user -e POSTGRES_PASSWORD=dADKHgj86jQoRoff7xwC4TZ -e POSTGRES_DB=scorm_db -e "POSTGRES_HOST_AUTH_METHOD=trust" -p "5432:5432" postgres:12

SQL Create Table

create table courses
(
    course_id serial not null
        constraint courses_pk
            primary key,
    name      varchar(255)
);

create table progress
(
    id        serial not null
        constraint progress_pk
            primary key,
    user_id   integer,
    course_id integer,
    location  integer,
    status    boolean,
    score     integer
);