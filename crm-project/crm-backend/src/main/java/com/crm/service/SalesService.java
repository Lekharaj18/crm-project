package com.crm.service;

import com.crm.model.Sales;
import com.crm.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesService {

    private final SalesRepository salesRepository;

    public List<Sales> getAllSales() {
        return salesRepository.findAll();
    }

    public Sales getSalesById(Long id) {
        return salesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales record not found"));
    }

    public Sales createSales(Sales sales) {
        return salesRepository.save(sales);
    }

    public Sales updateSales(Long id, Sales salesDetails) {
        Sales sales = getSalesById(id);
        sales.setCustomer(salesDetails.getCustomer());
        sales.setAmount(salesDetails.getAmount());
        sales.setStatus(salesDetails.getStatus());
        sales.setDate(salesDetails.getDate());
        sales.setAssignedSalesRep(salesDetails.getAssignedSalesRep());
        return salesRepository.save(sales);
    }

    public void deleteSales(Long id) {
        Sales sales = getSalesById(id);
        salesRepository.delete(sales);
    }
}
