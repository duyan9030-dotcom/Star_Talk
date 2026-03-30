package com.startalk.startalk.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
public class RedisUtil {

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    private final ConcurrentHashMap<String, Object> localCache = new ConcurrentHashMap<>();

    public void set(String key, Object value) {
        if (redisTemplate != null) {
            redisTemplate.opsForValue().set(key, value);
        } else {
            localCache.put(key, value);
        }
    }

    public void set(String key, Object value, long timeout, TimeUnit unit) {
        if (redisTemplate != null) {
            redisTemplate.opsForValue().set(key, value, timeout, unit);
        } else {
            localCache.put(key, value);
        }
    }

    public Object get(String key) {
        if (redisTemplate != null) {
            return redisTemplate.opsForValue().get(key);
        } else {
            return localCache.get(key);
        }
    }

    public Boolean delete(String key) {
        if (redisTemplate != null) {
            return redisTemplate.delete(key);
        } else {
            return localCache.remove(key) != null;
        }
    }

    public Boolean hasKey(String key) {
        if (redisTemplate != null) {
            return redisTemplate.hasKey(key);
        } else {
            return localCache.containsKey(key);
        }
    }

    public Boolean expire(String key, long timeout, TimeUnit unit) {
        if (redisTemplate != null) {
            return redisTemplate.expire(key, timeout, unit);
        } else {
            return true;
        }
    }
}