package com.crm.controller;

import com.crm.model.Sales;
import com.crm.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SalesController {

    private final SalesService salesService;

    @GetMapping
    public ResponseEntity<List<Sales>> getAllSales() {
        return ResponseEntity.ok(salesService.getAllSales());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sales> getSalesById(@PathVariable Long id) {
        return ResponseEntity.ok(salesService.getSalesById(id));
    }

    @PostMapping
    public ResponseEntity<Sales> createSales(@RequestBody Sales sales) {
        return new ResponseEntity<>(salesService.createSales(sales), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sales> updateSales(@PathVariable Long id, @RequestBody Sales sales) {
        return ResponseEntity.ok(salesService.updateSales(id, sales));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSales(@PathVariable Long id) {
        salesService.deleteSales(id);
        return ResponseEntity.ok("Sales record deleted successfully.");
    }
}
