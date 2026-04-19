package com.crm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String contactInfo;

    @Enumerated(EnumType.STRING)
    private LeadSource source;

    @Enumerated(EnumType.STRING)
    private LeadStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_sales_rep_id")
    private User assignedSalesRep;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
