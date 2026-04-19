package com.crm.service;

import com.crm.model.Lead;
import com.crm.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    public Lead getLeadById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
    }

    public Lead createLead(Lead lead) {
        return leadRepository.save(lead);
    }

    public Lead updateLead(Long id, Lead leadDetails) {
        Lead lead = getLeadById(id);
        lead.setName(leadDetails.getName());
        lead.setContactInfo(leadDetails.getContactInfo());
        lead.setSource(leadDetails.getSource());
        lead.setStatus(leadDetails.getStatus());
        lead.setAssignedSalesRep(leadDetails.getAssignedSalesRep());
        return leadRepository.save(lead);
    }

    public void deleteLead(Long id) {
        Lead lead = getLeadById(id);
        leadRepository.delete(lead);
    }
}
