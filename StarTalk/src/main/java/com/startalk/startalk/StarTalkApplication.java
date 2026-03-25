package com.startalk.startalk;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan({"com.startalk.startalk.mapper", "com.startalk.startalk.center.mapper", "com.startalk.startalk.parent.mapper", "com.startalk.startalk.conversation.mapper", "com.startalk.startalk.incentive.mapper", "com.startalk.startalk.word.mapper"})
public class StarTalkApplication {
    public static void main(String[] args) {
        SpringApplication.run(StarTalkApplication.class, args);
    }
}