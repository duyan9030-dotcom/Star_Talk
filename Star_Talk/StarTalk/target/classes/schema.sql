-- AI少儿英语学习平台 数据库初始化脚本
CREATE DATABASE IF NOT EXISTS startalk DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE startalk;

-- 用户表
DROP TABLE IF EXISTS sys_user;
CREATE TABLE sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    openid VARCHAR(128) COMMENT '微信openid',
    unionid VARCHAR(128) COMMENT '微信unionid',
    phone VARCHAR(20) COMMENT '手机号',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(500) COMMENT '头像URL',
    age INT COMMENT '年龄',
    grade VARCHAR(20) COMMENT '年级',
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT' COMMENT '角色: STUDENT-学生, PARENT-家长, ADMIN-管理员',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
    password VARCHAR(128) COMMENT '密码(预留)',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_openid (openid),
    INDEX idx_phone (phone),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 短信验证码记录表
DROP TABLE IF EXISTS sms_log;
CREATE TABLE sms_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    send_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expire_time DATETIME NOT NULL,
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='短信发送记录表';

-- 对话场景表
DROP TABLE IF EXISTS conversation_scene;
CREATE TABLE conversation_scene (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    prompt VARCHAR(500),
    icon VARCHAR(100),
    difficulty INT DEFAULT 1,
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='对话场景表';

-- 对话会话表
DROP TABLE IF EXISTS conversation_session;
CREATE TABLE conversation_session (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    scene_id BIGINT NOT NULL,
    scene_name VARCHAR(50),
    status INT DEFAULT 1,
    message_count INT DEFAULT 0,
    start_time DATETIME,
    end_time DATETIME,
    duration INT DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='对话会话表';

-- 对话消息表
DROP TABLE IF EXISTS conversation_message;
CREATE TABLE conversation_message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT,
    audio_url VARCHAR(500),
    audio_text VARCHAR(500),
    duration INT,
    token INT,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='对话消息表';

-- 对话纠错报告表
DROP TABLE IF EXISTS conversation_feedback;
CREATE TABLE conversation_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    feedback TEXT,
    overall_score INT,
    grammar_issues TEXT,
    pronunciation_issues TEXT,
    suggestions TEXT,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='对话纠错报告表';

-- 单词表
DROP TABLE IF EXISTS word;
CREATE TABLE word (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    phonetic VARCHAR(100),
    phonetic_audio VARCHAR(500),
    meaning VARCHAR(200) NOT NULL,
    part_of_speech VARCHAR(20),
    example_sentence TEXT,
    example_translation TEXT,
    example_audio VARCHAR(500),
    image_url VARCHAR(500),
    difficulty INT DEFAULT 1,
    category VARCHAR(50),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    INDEX idx_word (word),
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='单词表';

-- 用户单词记录表
DROP TABLE IF EXISTS user_word_record;
CREATE TABLE user_word_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    word_id BIGINT NOT NULL,
    master_level INT DEFAULT 0,
    study_count INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    last_study_time DATETIME,
    next_review_time DATETIME,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user_word (user_id, word_id),
    INDEX idx_user_id (user_id),
    INDEX idx_next_review (next_review_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户单词记录表';

-- 用户单词收藏表
DROP TABLE IF EXISTS user_word_favorite;
CREATE TABLE user_word_favorite (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    word_id BIGINT NOT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user_word (user_id, word_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户单词收藏表';

-- 积分规则表
DROP TABLE IF EXISTS points_rule;
CREATE TABLE points_rule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    points INT NOT NULL,
    daily_limit INT DEFAULT 0,
    status INT DEFAULT 1,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_source (source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分规则表';

-- 用户积分表
DROP TABLE IF EXISTS user_points;
CREATE TABLE user_points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_points INT DEFAULT 0,
    available_points INT DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户积分表';

-- 积分记录表
DROP TABLE IF EXISTS points_log;
CREATE TABLE points_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    points INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    source VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';

-- 打卡记录表
DROP TABLE IF EXISTS checkin_log;
CREATE TABLE checkin_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    checkin_date DATE NOT NULL,
    duration INT DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user_date (user_id, checkin_date),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='打卡记录表';

-- 徽章表
DROP TABLE IF EXISTS badge;
CREATE TABLE badge (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(100),
    description VARCHAR(200),
`condition` VARCHAR(200),
    points INT DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='徽章表';

-- 用户徽章表
DROP TABLE IF EXISTS user_badge;
CREATE TABLE user_badge (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user_badge (user_id, badge_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户徽章表';

-- 奖励表
DROP TABLE IF EXISTS reward;
CREATE TABLE reward (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(100),
    description VARCHAR(200),
    points INT NOT NULL,
    stock INT DEFAULT 0,
    type INT DEFAULT 1,
    status INT DEFAULT 1,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='奖励表';

-- 用户奖励记录表
DROP TABLE IF EXISTS user_reward_record;
CREATE TABLE user_reward_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    reward_id BIGINT NOT NULL,
    points_spent INT NOT NULL,
    status INT DEFAULT 1,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户奖励记录表';

-- 用户设置表
DROP TABLE IF EXISTS user_setting;
CREATE TABLE user_setting (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    language VARCHAR(20) DEFAULT 'zh-CN',
    notification_enabled TINYINT DEFAULT 1,
    daily_limit INT DEFAULT 60,
    allowed_time_start VARCHAR(10),
    allowed_time_end VARCHAR(10),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户设置表';

-- 意见反馈表
DROP TABLE IF EXISTS feedback;
CREATE TABLE feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    images VARCHAR(1000),
    status INT DEFAULT 0,
    reply TEXT,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='意见反馈表';

-- 绘本表
DROP TABLE IF EXISTS picture_book;
CREATE TABLE picture_book (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    cover_url VARCHAR(500),
    description TEXT,
    difficulty INT DEFAULT 1,
    category VARCHAR(50),
    page_count INT DEFAULT 0,
    audio_url VARCHAR(500),
    status INT DEFAULT 1,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='绘本表';

-- 绘本页面表
DROP TABLE IF EXISTS picture_book_page;
CREATE TABLE picture_book_page (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    page_number INT NOT NULL,
    image_url VARCHAR(500),
    text_content TEXT,
    audio_url VARCHAR(500),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_book_page (book_id, page_number),
    INDEX idx_book_id (book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='绘本页面表';

-- 用户绘本阅读记录表
DROP TABLE IF EXISTS user_book_record;
CREATE TABLE user_book_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    current_page INT DEFAULT 1,
    status INT DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user_book (user_id, book_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户绘本阅读记录表';

-- 用户绘本收藏表
DROP TABLE IF EXISTS user_book_favorite;
CREATE TABLE user_book_favorite (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user_book (user_id, book_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户绘本收藏表';

-- 家长与孩子关联表
DROP TABLE IF EXISTS parent_child_relation;
CREATE TABLE parent_child_relation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT NOT NULL COMMENT '家长用户ID',
    child_id BIGINT NOT NULL COMMENT '孩子用户ID',
    relation_name VARCHAR(50) COMMENT '关系名称如"儿子"、"女儿"',
    status INT DEFAULT 1 COMMENT '状态: 0-已解除, 1-正常',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_parent_child (parent_id, child_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_child_id (child_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家长与孩子关联表';

-- 家长管控设置表
DROP TABLE IF EXISTS parent_control_settings;
CREATE TABLE parent_control_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT NOT NULL COMMENT '家长用户ID',
    child_id BIGINT NOT NULL COMMENT '孩子用户ID',
    daily_limit_minutes INT DEFAULT 60 COMMENT '每日使用时长限制(分钟)',
    allowed_time_start VARCHAR(10) COMMENT '允许使用开始时间 如"19:00"',
    allowed_time_end VARCHAR(10) COMMENT '允许使用结束时间 如"21:00"',
    is_locked TINYINT DEFAULT 0 COMMENT '是否锁定: 0-未锁定, 1-已锁定',
    unlock_password VARCHAR(128) COMMENT '解锁密码(BCrypt加密)',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_child (child_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家长管控设置表';

-- 插入默认对话场景
INSERT INTO conversation_scene (name, name_en, description, prompt, icon, difficulty, sort, status) VALUES
('点餐', 'Ordering Food', '在餐厅点餐', 'You are a waiter. Help customer order food.', 'food', 1, 1, 1),
('问路', 'Asking for Directions', '问路指路', 'You are a helpful local. Give directions.', 'direction', 1, 2, 1),
('自我介绍', 'Self Introduction', '介绍自己', 'You are friendly. Encourage introduction.', 'user', 1, 3, 1),
('购物', 'Shopping', '商店购物', 'You are a shop assistant. Help customer.', 'shopping', 2, 4, 1),
('看病', 'Seeing a Doctor', '医院看病', 'You are a doctor. Ask symptoms.', 'medical', 2, 5, 1);

-- 插入积分规则
INSERT INTO points_rule (source, description, points, daily_limit, status) VALUES
('CONVERSATION', '完成一次口语对话', 10, 5, 1),
('READING', '阅读一本绘本', 5, 3, 1),
('WORD_TEST', '完成单词测试', 3, 10, 1),
('CHECKIN', '每日打卡', 5, 1, 1);

-- 插入徽章
INSERT INTO badge (name, icon, description, `condition`, points) VALUES
('口语达人', 'badge_speech.png', '完成10次口语对话', 'conversation_count>=10', 0),
('阅读之星', 'badge_read.png', '阅读5本绘本', 'book_count>=5', 0),
('单词大师', 'badge_word.png', '掌握50个单词', 'word_count>=50', 0),
('坚持不懈', 'badge_persist.png', '连续打卡7天', 'checkin_days>=7', 0);

-- 插入奖励
INSERT INTO reward (name, icon, description, points, stock, type, status) VALUES
('金牌头像框', 'frame_gold.png', '金光闪闪的金牌头像框', 100, 100, 1, 1),
('银牌头像框', 'frame_silver.png', '优雅银色头像框', 50, 200, 1, 1),
('口语新星徽章', 'badge_new.png', '口语新星专属徽章', 80, 100, 2, 1),
('每日达人徽章', 'badge_daily.png', '每日学习达人专属', 30, 500, 2, 1);

-- 插入示例单词
INSERT INTO word (word, phonetic, meaning, part_of_speech, example_sentence, example_translation, difficulty, category) VALUES
('apple', '/ˈæpl/', '苹果', 'n.', 'I eat an apple every day.', '我每天吃一个苹果。', 1, 'fruit'),
('banana', '/bəˈnɑːnə/', '香蕉', 'n.', 'The banana is yellow.', '香蕉是黄色的。', 1, 'fruit'),
('orange', '/ˈɔːrɪndʒ/', '橙子', 'n.', 'I like orange juice.', '我喜欢橙汁。', 1, 'fruit'),
('hello', '/həˈloʊ/', '你好', 'int.', 'Hello, how are you?', '你好，你好吗？', 1, 'greeting'),
('thank', '/θæŋk/', '感谢', 'v.', 'Thank you very much.', '非常感谢你。', 1, 'greeting');

-- 管理员表
DROP TABLE IF EXISTS sys_admin;
CREATE TABLE sys_admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '管理员ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(128) NOT NULL COMMENT '密码(BCrypt加密)',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(500) COMMENT '头像URL',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    status INT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除',
    UNIQUE KEY uk_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 单词分类表
DROP TABLE IF EXISTS word_category;
CREATE TABLE word_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    name_en VARCHAR(50) COMMENT '英文名称',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID',
    sort INT DEFAULT 0 COMMENT '排序',
    status INT DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='单词分类表';

-- 系统设置表
DROP TABLE IF EXISTS system_setting;
CREATE TABLE system_setting (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL COMMENT '配置键',
    setting_value VARCHAR(500) COMMENT '配置值',
    description VARCHAR(200) COMMENT '描述',
    `group` VARCHAR(50) COMMENT '分组',
    sort INT DEFAULT 0 COMMENT '排序',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除',
    UNIQUE KEY uk_setting_key (setting_key),
    INDEX idx_group (`group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统设置表';

-- 插入默认管理员 (密码: admin123)
INSERT INTO sys_admin (username, password, nickname, phone, email, status) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '超级管理员', '13800138000', 'admin@startalk.com', 1);

-- 插入默认单词分类
INSERT INTO word_category (name, name_en, parent_id, sort, status) VALUES
('水果', 'Fruit', 0, 1, 1),
('动物', 'Animal', 0, 2, 1),
('颜色', 'Color', 0, 3, 1),
('数字', 'Number', 0, 4, 1),
('家庭', 'Family', 0, 5, 1);

-- 插入系统默认设置
INSERT INTO system_setting (setting_key, setting_value, description, `group`, sort) VALUES
('site_name', 'StarTalk', '网站名称', 'basic', 1),
('site_logo', '/logo.png', '网站Logo', 'basic', 2),
('ai_model', 'chatglm', '默认AI模型', 'ai', 1),
('ai_temperature', '0.7', 'AI温度参数', 'ai', 2),
('max_tokens', '2000', '最大Token数', 'ai', 3),
('daily_word_limit', '20', '每日单词学习上限', 'learning', 1),
('points_conversation', '10', '对话积分奖励', 'points', 1),
('points_checkin', '5', '签到积分奖励', 'points', 2),
('version', '1.0.0', '系统版本', 'system', 1);
