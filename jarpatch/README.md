# Jarpatch

A Spring Boot REST API application for applying patches to JAR and WAR files.

## Project Description

Jarpatch is a utility service built with Spring Boot that provides endpoints to apply patches to JAR and WAR archives. It handles file operations, ZIP manipulation, and patch application through a simple REST API interface.

## Author

**Kishan Singh**

## Technology Stack

- **Framework**: Spring Boot 4.0.0
- **Language**: Java 21
- **Build Tool**: Maven
- **Key Dependencies**:
  - Spring Web MVC
  - Lombok
  - JUnit 5 (for testing)

## Project Structure

```
src/
├── main/
│   ├── java/com/kishan/jarpatch/
│   │   ├── JarpatchApplication.java       # Main application entry point
│   │   ├── controllers/
│   │   │   └── PatchController.java       # REST API endpoints
│   │   ├── services/
│   │   │   └── PatchService.java          # Business logic for patching
│   │   └── util/
│   │       └── ZipUtil.java               # ZIP file utilities
│   └── resources/
│       └── application.properties         # Application configuration
└── test/
    └── java/com/kishan/jarpatch/         # Unit tests
```

## API Endpoints

### Apply Patch
- **Endpoint**: `POST /api/patch/apply`
- **Description**: Applies a patch to a JAR or WAR file
- **Request Body**:
  ```json
  {
    "warPath": "/path/to/archive.war",
    "patchPath": "/path/to/patch.zip"
  }
  ```

## Getting Started

### Prerequisites
- Java 21 or higher
- Maven 3.6+

### Building the Project

```bash
# Using Maven
mvn clean install

# Or using the provided batch file (Windows)
startApp.bat
```

### Running the Application

```bash
# Using Maven
mvn spring-boot:run

# Or after building
java -jar target/jarpatch-0.0.1-SNAPSHOT.jar
```

## Features

- REST API for patch application
- Support for JAR and WAR files
- ZIP file manipulation utilities
- Spring Boot autoconfiguration
- Comprehensive error handling

## Configuration

Application settings can be modified in `src/main/resources/application.properties`.

## Testing

Run the test suite with Maven:

```bash
mvn test
```

## License

See `HELP.md` for additional reference documentation.

## Additional Resources

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/)
- [Spring Web Guides](https://spring.io/guides/gs/rest-service/)
- [Apache Maven Guide](https://maven.apache.org/guides/index.html)
