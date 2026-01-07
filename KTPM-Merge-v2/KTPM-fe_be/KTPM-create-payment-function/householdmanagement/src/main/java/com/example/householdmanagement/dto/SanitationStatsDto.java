package com.example.householdmanagement.dto;

public class SanitationStatsDto {
    private long peoplePaidCount;
    private long householdsUnpaidCount;

    public SanitationStatsDto() {}

    public SanitationStatsDto(long peoplePaidCount, long householdsUnpaidCount) {
        this.peoplePaidCount = peoplePaidCount;
        this.householdsUnpaidCount = householdsUnpaidCount;
    }

    public long getPeoplePaidCount() {
        return peoplePaidCount;
    }

    public void setPeoplePaidCount(long peoplePaidCount) {
        this.peoplePaidCount = peoplePaidCount;
    }

    public long getHouseholdsUnpaidCount() {
        return householdsUnpaidCount;
    }

    public void setHouseholdsUnpaidCount(long householdsUnpaidCount) {
        this.householdsUnpaidCount = householdsUnpaidCount;
    }
}

