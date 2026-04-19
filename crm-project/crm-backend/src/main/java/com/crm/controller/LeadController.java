package com.crm.controller;

import com.crm.model.Lead;
import com.crm.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    @PostMapping
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead) {
        return new ResponseEntity<>(leadService.createLead(lead), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable Long id, @RequestBody Lead lead) {
        return ResponseEntity.ok(leadService.updateLead(id, lead));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.ok("Lead deleted successfully.");
    }
}
