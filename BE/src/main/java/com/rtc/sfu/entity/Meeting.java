package com.rtc.sfu.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Entity
@DynamicInsert
@Setter
@Getter
public class Meeting {
    @Id
    private String sessionId;

    private String title;
    @OneToOne
    @JoinColumn(name="consultantId")
    private Consultant consultantId;
    @ColumnDefault("0")
    private int cnt;
    @ColumnDefault("true")
    private Boolean status;
    private String userName;
    @CreationTimestamp
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime meetingRegisterTime;
}
