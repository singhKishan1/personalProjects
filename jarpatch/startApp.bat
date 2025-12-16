@   echo off

REM Set the name of your executable JAR file
SET JAR_FILE=target\jarpatch-0.0.1-SNAPSHOT.jar

REM Optional: Set Java options (e.g., memory limits, active profiles)
SET JAVA_OPTS=-Xmx512M

echo Starting %JAR_FILE% in the background...
START "Spring Boot Application" java %JAVA_OPTS% -jar %JAR_FILE%
