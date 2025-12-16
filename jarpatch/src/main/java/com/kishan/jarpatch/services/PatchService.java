package com.kishan.jarpatch.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.kishan.jarpatch.util.ZipUtil;

import lombok.NoArgsConstructor;

@Service
@NoArgsConstructor
public class PatchService {
    private static final String MAPPING_FILENAME = "patch.txt";
    private static final String WEBINF_LIB = "WEB-INF/lib/";
    private static final String WEBINF_CLASSES = "WEB-INF/classes/";

    public Path applyPatch(String warPath, String patchDir) throws IOException{
        // Create backup before applying patch on the same war path
        Path parentPath = Paths.get(warPath).getParent();
        System.out.println("Parent Path: " + parentPath.toString());

        // Create backup directory if it doesn't exist
        backupWarFile(warPath, parentPath.toString());


        // Read patch mappings
        Map<String, String> classToJarMap = new HashMap<>();
        extractPatchMappings(patchDir, classToJarMap);

        // unzip war file to temp directory
        ZipUtil.unzip(Paths.get(warPath), parentPath.resolve("temp_war_extracted"));


        // Apply patches
        for (Map.Entry<String, String> entry : classToJarMap.entrySet()) {
            String classPath = entry.getKey();
            String jarName = entry.getValue();

            String classFileName = classPathToFile(classPath);
            classFileName = classFileName.substring(classFileName.lastIndexOf("/") + 1);
            Path classFile = Paths.get(patchDir, classFileName);

            if (jarName.equals("classes")) {
                // Patch in WEB-INF/classes
                Path targetClassPath = parentPath.resolve("temp_war_extracted")
                        .resolve(WEBINF_CLASSES);
                Files.createDirectories(targetClassPath.getParent());
                Files.copy(classFile, targetClassPath, StandardCopyOption.REPLACE_EXISTING);
            } else {
                // Patch in JAR file inside WEB-INF/lib
                Path jarPath = parentPath.resolve("temp_war_extracted")
                        .resolve(jarName);
                patchJar(jarPath, classFile, classPath);
            }
        }

        return Paths.get(warPath);
        
    }




    /**
     * Creates a backup of the specified WAR file in the given backup directory.
     * <h1>Backup War File</h1>
     * <p>This method creates a timestamped backup of the specified WAR file
     * in the provided backup directory. The backup file will have the same name
     * as the original WAR file, appended with the current date and time to ensure uniqueness.</p>
     * @param warPath
     * @param backupDir
     * @throws IOException
     */
    private static void backupWarFile(String warPath, String backupDir) throws IOException {
        Path source = Paths.get(warPath);

        if (!Files.exists(source)) {
            throw new RuntimeException("WAR file not found: " + warPath);
        }

        // Timestamp for backup
        String timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));

        Path target = Paths.get(
                backupDir,
                source.getFileName().toString().replace(".war", "-" + timestamp + "bkp.war")
        );

        Files.createDirectories(target.getParent());

        Files.copy(source, target, StandardCopyOption.COPY_ATTRIBUTES);

        System.out.println("Backup created at: " + target);
    }


    /**
     * Extracts patch mappings from the specified patch directory and populates the provided map.
     * <h1>Extract Patch Mappings</h1>
     * @param patchDir
     * @param classToJarMap
     * @throws IOException
     */
    private void extractPatchMappings(String patchDir, Map<String, String> classToJarMap) throws IOException {
        Files.lines(Paths.get(patchDir, MAPPING_FILENAME))
            .forEach(line -> {
                String[] parts = line.split("=");
                classToJarMap.put(parts[1], parts[0]);
            });

    }

    private String classPathToFile(String classPath) {
        return classPath.replace(".", "/") + ".class";
    }


    private void patchJar(Path jarPath, Path classFile, String classPath ) throws IOException {

        Path tempDir = Files.createTempDirectory("jar-temp");
        ZipUtil.unzip(jarPath, tempDir);

        Path targetClass = tempDir.resolve(classPathToFile(classPath));
        Files.createDirectories(targetClass.getParent());

        Files.copy(classFile, targetClass, StandardCopyOption.REPLACE_EXISTING);

        ZipUtil.zip(tempDir, jarPath);
    }

}
