package com.kishan.jarpatch.controllers;

import java.nio.file.Path;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kishan.jarpatch.services.PatchService;

@RestController
@RequestMapping("/api/patch")
public class PatchController {

    private final PatchService patchService;

    public PatchController(PatchService patchService) {
        this.patchService = patchService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyPatch(@RequestBody Map<String, String> payload){
        String warPath = payload.get("warPath");
        String patchPath = payload.get("patchPath");
        // String outputJarPath = payload.get("outputJarPath");

        try {
            Path resultPath = patchService.applyPatch(warPath, patchPath);
            return ResponseEntity.ok("Patched JAR created at: " + resultPath.toString());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error applying patch: " + e.getMessage());
        }
    }
    
}
