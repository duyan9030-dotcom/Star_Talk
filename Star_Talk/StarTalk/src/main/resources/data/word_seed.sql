-- 少儿英语单词种子数据
-- 建议分批次执行，每次50条

-- 基础词汇 (Basic Words)
INSERT INTO word (word, phonetic, phonetic_audio, meaning, part_of_speech, example_sentence, example_translation, example_audio, image_url, difficulty, category, create_time, update_time, deleted) VALUES
('hello', 'həˈloʊ', '/audio/hello.mp3', '你好', 'interjection', 'Hello, how are you?', '你好，你好吗？', '/audio/hello_ex.mp3', '/img/hello.jpg', 1, 'basic', NOW(), NOW(), 0),
('world', 'wɜːrld', '/audio/world.mp3', '世界', 'noun', 'The world is very big.', '世界非常大。', '/audio/world_ex.mp3', '/img/world.jpg', 1, 'basic', NOW(), NOW(), 0),
('happy', 'ˈhæpi', '/audio/happy.mp3', '开心的', 'adjective', 'I am very happy today.', '我今天非常开心。', '/audio/happy_ex.mp3', '/img/happy.jpg', 1, 'basic', NOW(), NOW(), 0),
('love', 'lʌv', '/audio/love.mp3', '爱', 'verb/noun', 'I love my family.', '我爱我的家人。', '/audio/love_ex.mp3', '/img/love.jpg', 1, 'basic', NOW(), NOW(), 0),
('friend', 'frend', '/audio/friend.mp3', '朋友', 'noun', 'She is my best friend.', '她是我最好的朋友。', '/audio/friend_ex.mp3', '/img/friend.jpg', 1, 'basic', NOW(), NOW(), 0),
('family', 'ˈfæməli', '/audio/family.mp3', '家庭', 'noun', 'My family has four people.', '我的家庭有四口人。', '/audio/family_ex.mp3', '/img/family.jpg', 1, 'basic', NOW(), NOW(), 0),
('mother', 'ˈmʌðər', '/audio/mother.mp3', '妈妈', 'noun', 'My mother cooks delicious food.', '我妈妈做很美味的食物。', '/audio/mother_ex.mp3', '/img/mother.jpg', 1, 'basic', NOW(), NOW(), 0),
('father', 'ˈfɑːðər', '/audio/father.mp3', '爸爸', 'noun', 'My father is tall.', '我爸爸很高。', '/audio/father_ex.mp3', '/img/father.jpg', 1, 'basic', NOW(), NOW(), 0),
('school', 'skuːl', '/audio/school.mp3', '学校', 'noun', 'I go to school every day.', '我每天去学校。', '/audio/school_ex.mp3', '/img/school.jpg', 1, 'basic', NOW(), NOW(), 0),
('book', 'bʊk', '/audio/book.mp3', '书', 'noun', 'I like to read books.', '我喜欢读书。', '/audio/book_ex.mp3', '/img/book.jpg', 1, 'basic', NOW(), NOW(), 0),
('cat', 'kæt', '/audio/cat.mp3', '猫', 'noun', 'The cat is sleeping.', '那只猫在睡觉。', '/audio/cat_ex.mp3', '/img/cat.jpg', 1, 'basic', NOW(), NOW(), 0),
('dog', 'dɔːɡ', '/audio/dog.mp3', '狗', 'noun', 'The dog is running.', '那只狗在跑。', '/audio/dog_ex.mp3', '/img/dog.jpg', 1, 'basic', NOW(), NOW(), 0),
('apple', 'ˈæpl', '/audio/apple.mp3', '苹果', 'noun', 'I eat an apple every day.', '我每天吃一个苹果。', '/audio/apple_ex.mp3', '/img/apple.jpg', 1, 'basic', NOW(), NOW(), 0),
('water', 'ˈwɔːtər', '/audio/water.mp3', '水', 'noun', 'I drink water every day.', '我每天喝水。', '/audio/water_ex.mp3', '/img/water.jpg', 1, 'basic', NOW(), NOW(), 0),
('food', 'fuːd', '/audio/food.mp3', '食物', 'noun', 'I like Chinese food.', '我喜欢中国食物。', '/audio/food_ex.mp3', '/img/food.jpg', 1, 'basic', NOW(), NOW(), 0),
('sun', 'sʌn', '/audio/sun.mp3', '太阳', 'noun', 'The sun is bright.', '太阳很明亮。', '/audio/sun_ex.mp3', '/img/sun.jpg', 1, 'basic', NOW(), NOW(), 0),
('moon', 'muːn', '/audio/moon.mp3', '月亮', 'noun', 'The moon is round tonight.', '今晚月亮很圆。', '/audio/moon_ex.mp3', '/img/moon.jpg', 1, 'basic', NOW(), NOW(), 0),
('star', 'stɑːr', '/audio/star.mp3', '星星', 'noun', 'I see many stars at night.', '我晚上看到很多星星。', '/audio/star_ex.mp3', '/img/star.jpg', 1, 'basic', NOW(), NOW(), 0),
('tree', 'triː', '/audio/tree.mp3', '树', 'noun', 'The tree is very tall.', '那棵树很高。', '/audio/tree_ex.mp3', '/img/tree.jpg', 1, 'basic', NOW(), NOW(), 0),
('flower', 'ˈflaʊər', '/audio/flower.mp3', '花', 'noun', 'The flower is beautiful.', '这朵花很漂亮。', '/audio/flower_ex.mp3', '/img/flower.jpg', 1, 'basic', NOW(), NOW(), 0);

-- 颜色 (Colors)
INSERT INTO word (word, phonetic, phonetic_audio, meaning, part_of_speech, example_sentence, example_translation, example_audio, image_url, difficulty, category, create_time, update_time, deleted) VALUES
('red', 'red', '/audio/red.mp3', '红色', 'adjective', 'The apple is red.', '苹果是红色的。', '/audio/red_ex.mp3', '/img/red.jpg', 1, 'color', NOW(), NOW(), 0),
('blue', 'bluː', '/audio/blue.mp3', '蓝色', 'adjective', 'The sky is blue.', '天空是蓝色的。', '/audio/blue_ex.mp3', '/img/blue.jpg', 1, 'color', NOW(), NOW(), 0),
('green', 'ɡriːn', '/audio/green.mp3', '绿色', 'adjective', 'The grass is green.', '草是绿色的。', '/audio/green_ex.mp3', '/img/green.jpg', 1, 'color', NOW(), NOW(), 0),
('yellow', 'ˈjeloʊ', '/audio/yellow.mp3', '黄色', 'adjective', 'The banana is yellow.', '香蕉是黄色的。', '/audio/yellow_ex.mp3', '/img/yellow.jpg', 1, 'color', NOW(), NOW(), 0),
('orange', 'ˈɔːrɪndʒ', '/audio/orange.mp3', '橙色', 'adjective', 'The orange is orange.', '橙子是橙色的。', '/audio/orange_ex.mp3', '/img/orange.jpg', 1, 'color', NOW(), NOW(), 0),
('purple', 'ˈpɜːrpl', '/audio/purple.mp3', '紫色', 'adjective', 'The flower is purple.', '那朵花是紫色的。', '/audio/purple_ex.mp3', '/img/purple.jpg', 1, 'color', NOW(), NOW(), 0),
('white', 'waɪt', '/audio/white.mp3', '白色', 'adjective', 'The snow is white.', '雪是白色的。', '/audio/white_ex.mp3', '/img/white.jpg', 1, 'color', NOW(), NOW(), 0),
('black', 'blæk', '/audio/black.mp3', '黑色', 'adjective', 'The cat is black.', '那只猫是黑色的。', '/audio/black_ex.mp3', '/img/black.jpg', 1, 'color', NOW(), NOW(), 0);

-- 数字 (Numbers)
INSERT INTO word (word, phonetic, phonetic_audio, meaning, part_of_speech, example_sentence, example_translation, example_audio, image_url, difficulty, category, create_time, update_time, deleted) VALUES
('one', 'wʌn', '/audio/one.mp3', '一', 'number', 'I have one apple.', '我有一个苹果。', '/audio/one_ex.mp3', '/img/one.jpg', 1, 'number', NOW(), NOW(), 0),
('two', 'tuː', '/audio/two.mp3', '二', 'number', 'Two plus two is four.', '二加二等于四。', '/audio/two_ex.mp3', '/img/two.jpg', 1, 'number', NOW(), NOW(), 0),
('three', 'θriː', '/audio/three.mp3', '三', 'number', 'Three friends are playing.', '三个朋友在玩耍。', '/audio/three_ex.mp3', '/img/three.jpg', 1, 'number', NOW(), NOW(), 0),
('four', 'fɔːr', '/audio/four.mp3', '四', 'number', 'I am four years old.', '我四岁了。', '/audio/four_ex.mp3', '/img/four.jpg', 1, 'number', NOW(), NOW(), 0),
('five', 'faɪv', '/audio/five.mp3', '五', 'number', 'Five fingers on my hand.', '我手上有五根手指。', '/audio/five_ex.mp3', '/img/five.jpg', 1, 'number', NOW(), NOW(), 0),
('six', 'sɪks', '/audio/six.mp3', '六', 'number', 'Six students are here.', '这里有六个学生。', '/audio/six_ex.mp3', '/img/six.jpg', 1, 'number', NOW(), NOW(), 0),
('seven', 'ˈsevn', '/audio/seven.mp3', '七', 'number', 'Seven days in a week.', '一周有七天。', '/audio/seven_ex.mp3', '/img/seven.jpg', 1, 'number', NOW(), NOW(), 0),
('eight', 'eɪt', '/audio/eight.mp3', '八', 'number', 'I am eight years old.', '我八岁了。', '/audio/eight_ex.mp3', '/img/eight.jpg', 1, 'number', NOW(), NOW(), 0),
('nine', 'naɪn', '/audio/nine.mp3', '九', 'number', 'Nine planets in the solar system.', '太阳系有九大行星。', '/audio/nine_ex.mp3', '/img/nine.jpg', 1, 'number', NOW(), NOW(), 0),
('ten', 'ten', '/audio/ten.mp3', '十', 'number', 'Count from one to ten.', '从一数到十。', '/audio/ten_ex.mp3', '/img/ten.jpg', 1, 'number', NOW(), NOW(), 0);

-- 动物 (Animals)
INSERT INTO word (word, phonetic, phonetic_audio, meaning, part_of_speech, example_sentence, example_translation, example_audio, image_url, difficulty, category, create_time, update_time, deleted) VALUES
('bird', 'bɜːrd', '/audio/bird.mp3', '鸟', 'noun', 'The bird is flying.', '小鸟在飞。', '/audio/bird_ex.mp3', '/img/bird.jpg', 1, 'animal', NOW(), NOW(), 0),
('fish', 'fɪʃ', '/audio/fish.mp3', '鱼', 'noun', 'The fish is swimming.', '鱼在游泳。', '/audio/fish_ex.mp3', '/img/fish.jpg', 1, 'animal', NOW(), NOW(), 0),
('rabbit', 'ˈræbɪt', '/audio/rabbit.mp3', '兔子', 'noun', 'The rabbit is jumping.', '兔子在跳。', '/audio/rabbit_ex.mp3', '/img/rabbit.jpg', 1, 'animal', NOW(), NOW(), 0),
('elephant', 'ˈelɪfənt', '/audio/elephant.mp3', '大象', 'noun', 'The elephant is big.', '大象很大。', '/audio/elephant_ex.mp3', '/img/elephant.jpg', 2, 'animal', NOW(), NOW(), 0),
('monkey', 'ˈmʌŋki', '/audio/monkey.mp3', '猴子', 'noun', 'The monkey is eating banana.', '猴子在吃香蕉。', '/audio/monkey_ex.mp3', '/img/monkey.jpg', 1, 'animal', NOW(), NOW(), 0),
('tiger', 'ˈtaɪɡər', '/audio/tiger.mp3', '老虎', 'noun', 'The tiger is strong.', '老虎很强壮。', '/audio/tiger_ex.mp3', '/img/tiger.jpg', 1, 'animal', NOW(), NOW(), 0),
('lion', 'ˈlaɪən', '/audio/lion.mp3', '狮子', 'noun', 'The lion is the king of animals.', '狮子是动物之王。', '/audio/lion_ex.mp3', '/img/lion.jpg', 1, 'animal', NOW(), NOW(), 0),
('panda', 'ˈpændə', '/audio/panda.mp3', '熊猫', 'noun', 'Panda is from China.', '熊猫来自中国。', '/audio/panda_ex.mp3', '/img/panda.jpg', 1, 'animal', NOW(), NOW(), 0);

-- 动作 (Actions)
INSERT INTO word (word, phonetic, phonetic_audio, meaning, part_of_speech, example_sentence, example_translation, example_audio, image_url, difficulty, category, create_time, update_time, deleted) VALUES
('run', 'rʌn', '/audio/run.mp3', '跑', 'verb', 'I run every morning.', '我每天早上跑步。', '/audio/run_ex.mp3', '/img/run.jpg', 1, 'action', NOW(), NOW(), 0),
('walk', 'wɔːk', '/audio/walk.mp3', '走', 'verb', 'I walk to school.', '我走路去学校。', '/audio/walk_ex.mp3', '/img/walk.jpg', 1, 'action', NOW(), NOW(), 0),
('eat', 'iːt', '/audio/eat.mp3', '吃', 'verb', 'I eat breakfast at home.', '我在家吃早餐。', '/audio/eat_ex.mp3', '/img/eat.jpg', 1, 'action', NOW(), NOW(), 0),
('drink', 'drɪŋk', '/audio/drink.mp3', '喝', 'verb', 'I drink milk every day.', '我每天喝牛奶。', '/audio/drink_ex.mp3', '/img/drink.jpg', 1, 'action', NOW(), NOW(), 0),
('sleep', 'sliːp', '/audio/sleep.mp3', '睡觉', 'verb', 'I sleep eight hours every night.', '我每晚睡八个小时。', '/audio/sleep_ex.mp3', '/img/sleep.jpg', 1, 'action', NOW(), NOW(), 0),
('play', 'pleɪ', '/audio/play.mp3', '玩', 'verb', 'Children like to play.', '孩子们喜欢玩。', '/audio/play_ex.mp3', '/img/play.jpg', 1, 'action', NOW(), NOW(), 0),
('read', 'riːd', '/audio/read.mp3', '读', 'verb', 'I read books every day.', '我每天读书。', '/audio/read_ex.mp3', '/img/read.jpg', 1, 'action', NOW(), NOW(), 0),
('write', 'raɪt', '/audio/write.mp3', '写', 'verb', 'I write with a pen.', '我用钢笔写字。', '/audio/write_ex.mp3', '/img/write.jpg', 1, 'action', NOW(), NOW(), 0),
('sing', 'sɪŋ', '/audio/sing.mp3', '唱歌', 'verb', 'I like to sing songs.', '我喜欢唱歌。', '/audio/sing_ex.mp3', '/img/sing.jpg', 1, 'action', NOW(), NOW(), 0),
('dance', 'dæns', '/audio/dance.mp3', '跳舞', 'verb', 'She can dance very well.', '她舞跳得很好。', '/audio/dance_ex.mp3', '/img/dance.jpg', 1, 'action', NOW(), NOW(), 0),
('swim', 'swɪm', '/audio/swim.mp3', '游泳', 'verb', 'I swim in summer.', '我在夏天游泳。', '/audio/swim_ex.mp3', '/img/swim.jpg', 1, 'action', NOW(), NOW(), 0),
('jump', 'dʒʌmp', '/audio/jump.mp3', '跳', 'verb', 'The frog can jump.', '青蛙会跳。', '/audio/jump_ex.mp3', '/img/jump.jpg', 1, 'action', NOW(), NOW(), 0);

-- 时间 (Time)
INSERT INTO word (word, phonetic, phonetic_audio, meaning, part_of_speech, example_sentence, example_translation, example_audio, image_url, difficulty, category, create_time, update_time, deleted) VALUES
('day', 'deɪ', '/audio/day.mp3', '天', 'noun', 'There are seven days in a week.', '一周有七天。', '/audio/day_ex.mp3', '/img/day.jpg', 1, 'time', NOW(), NOW(), 0),
('week', 'wiːk', '/audio/week.mp3', '周', 'noun', 'I go to school every week.', '我每周去学校。', '/audio/week_ex.mp3', '/img/week.jpg', 1, 'time', NOW(), NOW(), 0),
('month', 'mʌnθ', '/audio/month.mp3', '月', 'noun', 'There are twelve months in a year.', '一年有十二个月。', '/audio/month_ex.mp3', '/img/month.jpg', 1, 'time', NOW(), NOW(), 0),
('year', 'jɪər', '/audio/year.mp3', '年', 'noun', 'I am ten years old.', '我十岁了。', '/audio/year_ex.mp3', '/img/year.jpg', 1, 'time', NOW(), NOW(), 0),
('morning', 'ˈmɔːrnɪŋ', '/audio/morning.mp3', '早上', 'noun', 'I exercise in the morning.', '我早上锻炼。', '/audio/morning_ex.mp3', '/img/morning.jpg', 1, 'time', NOW(), NOW(), 0),
('afternoon', 'ˌæftərˈnuːn', '/audio/afternoon.mp3', '下午', 'noun', 'I have lunch in the afternoon.', '我下午吃午饭。', '/audio/afternoon_ex.mp3', '/img/afternoon.jpg', 1, 'time', NOW(), NOW(), 0),
('evening', 'ˈiːvnɪŋ', '/audio/evening.mp3', '晚上', 'noun', 'I watch TV in the evening.', '我晚上看电视。', '/audio/evening_ex.mp3', '/img/evening.jpg', 1, 'time', NOW(), NOW(), 0),
('today', 'təˈdeɪ', '/audio/today.mp3', '今天', 'adverb', 'Today is Monday.', '今天是星期一。', '/audio/today_ex.mp3', '/img/today.jpg', 1, 'time', NOW(), NOW(), 0),
('tomorrow', 'təˈmɔːroʊ', '/audio/tomorrow.mp3', '明天', 'adverb', 'Tomorrow is Tuesday.', '明天是星期二。', '/audio/tomorrow_ex.mp3', '/img/tomorrow.jpg', 1, 'time', NOW(), NOW(), 0),
('yesterday', 'ˈjestərdeɪ', '/audio/yesterday.mp3', '昨天', 'adverb', 'Yesterday was Sunday.', '昨天是星期天。', '/audio/yesterday_ex.mp3', '/img/yesterday.jpg', 1, 'time', NOW(), NOW(), 0);

-- 水果 (Fruits)
INSERT INTO word (word, phonetic, phonetic_audio, meaning, part_of_speech, example_sentence, example_translation, example_audio, image_url, difficulty, category, create_time, update_time, deleted) VALUES
('banana', 'bəˈnænə', '/audio/banana.mp3', '香蕉', 'noun', 'I like banana.', '我喜欢香蕉。', '/audio/banana_ex.mp3', '/img/banana.jpg', 1, 'fruit', NOW(), NOW(), 0),
('orange', 'ˈɔːrɪndʒ', '/audio/orange.mp3', '橙子', 'noun', 'Orange juice is delicious.', '橙汁很好喝。', '/audio/orange_ex.mp3', '/img/orange.jpg', 1, 'fruit', NOW(), NOW(), 0),
('grape', 'ɡreɪp', '/audio/grape.mp3', '葡萄', 'noun', 'Grapes are sweet.', '葡萄很甜。', '/audio/grape_ex.mp3', '/img/grape.jpg', 1, 'fruit', NOW(), NOW(), 0),
('strawberry', 'ˈstrɔːbəri', '/audio/strawberry.mp3', '草莓', 'noun', 'Strawberry is red.', '草莓是红色的。', '/audio/strawberry_ex.mp3', '/img/strawberry.jpg', 2, 'fruit', NOW(), NOW(), 0),
('watermelon', 'ˈwɔːtərmelən', '/audio/watermelon.mp3', '西瓜', 'noun', 'Watermelon is juicy in summer.', '夏天西瓜多汁。', '/audio/watermelon_ex.mp3', '/img/watermelon.jpg', 2, 'fruit', NOW(), NOW(), 0),
('pear', 'peər', '/audio/pear.mp3', '梨', 'noun', 'This pear is sweet.', '这个梨很甜。', '/audio/pear_ex.mp3', '/img/pear.jpg', 1, 'fruit', NOW(), NOW(), 0),
('peach', 'piːtʃ', '/audio/peach.mp3', '桃子', 'noun', 'The peach is soft.', '这个桃子是软的。', '/audio/peach_ex.mp3', '/img/peach.jpg', 1, 'fruit', NOW(), NOW(), 0),
('mango', 'ˈmæŋɡoʊ', '/audio/mango.mp3', '芒果', 'noun', 'Mango is my favorite fruit.', '芒果是我最喜欢的水果。', '/audio/mango_ex.mp3', '/img/mango.jpg', 2, 'fruit', NOW(), NOW(), 0);

-- 衣物 (Clothes)
INSERT INTO word (word, phonetic, phonetic_audio, meaning, part_of_speech, example_sentence, example_translation, example_audio, image_url, difficulty, category, create_time, update_time, deleted) VALUES
('hat', 'hæt', '/audio/hat.mp3', '帽子', 'noun', 'I wear a hat in summer.', '我夏天戴帽子。', '/audio/hat_ex.mp3', '/img/hat.jpg', 1, 'clothes', NOW(), NOW(), 0),
('shirt', 'ʃɜːrt', '/audio/shirt.mp3', '衬衫', 'noun', 'This shirt is blue.', '这件衬衫是蓝色的。', '/audio/shirt_ex.mp3', '/img/shirt.jpg', 1, 'clothes', NOW(), NOW(), 0),
('dress', 'dres', '/audio/dress.mp3', '裙子', 'noun', 'She wears a beautiful dress.', '她穿了一条漂亮的裙子。', '/audio/dress_ex.mp3', '/img/dress.jpg', 1, 'clothes', NOW(), NOW(), 0),
('shoe', 'ʃuː', '/audio/shoe.mp3', '鞋子', 'noun', 'These shoes are comfortable.', '这双鞋子很舒服。', '/audio/shoe_ex.mp3', '/img/shoe.jpg', 1, 'clothes', NOW(), NOW(), 0),
('sock', 'sɑːk', '/audio/sock.mp3', '袜子', 'noun', 'I have many pairs of socks.', '我有很多双袜子。', '/audio/sock_ex.mp3', '/img/sock.jpg', 1, 'clothes', NOW(), NOW(), 0),
('glove', 'ɡlʌv', '/audio/glove.mp3', '手套', 'noun', 'I wear gloves in winter.', '我冬天戴手套。', '/audio/glove_ex.mp3', '/img/glove.jpg', 1, 'clothes', NOW(), NOW(), 0),
('coat', 'koʊt', '/audio/coat.mp3', '外套', 'noun', 'This coat is warm.', '这件外套很暖和。', '/audio/coat_ex.mp3', '/img/coat.jpg', 1, 'clothes', NOW(), NOW(), 0),
('skirt', 'skɜːrt', '/audio/skirt.mp3', '短裙', 'noun', 'She is wearing a pink skirt.', '她穿着一条粉色短裙。', '/audio/skirt_ex.mp3', '/img/skirt.jpg', 1, 'clothes', NOW(), NOW(), 0);

-- 自然 (Nature)
INSERT INTO word (word, phonetic, phonetic_audio, meaning, part_of_speech, example_sentence, example_translation, example_audio, image_url, difficulty, category, create_time, update_time, deleted) VALUES
('rain', 'reɪn', '/audio/rain.mp3', '雨', 'noun/verb', 'It is raining today.', '今天在下雨。', '/audio/rain_ex.mp3', '/img/rain.jpg', 1, 'nature', NOW(), NOW(), 0),
('snow', 'snoʊ', '/audio/snow.mp3', '雪', 'noun/verb', 'It snows in winter.', '冬天下雪。', '/audio/snow_ex.mp3', '/img/snow.jpg', 1, 'nature', NOW(), NOW(), 0),
('wind', 'wɪnd', '/audio/wind.mp3', '风', 'noun', 'The wind is strong today.', '今天风很大。', '/audio/wind_ex.mp3', '/img/wind.jpg', 1, 'nature', NOW(), NOW(), 0),
('cloud', 'klaʊd', '/audio/cloud.mp3', '云', 'noun', 'The cloud is like a cotton.', '云像棉花。', '/audio/cloud_ex.mp3', '/img/cloud.jpg', 1, 'nature', NOW(), NOW(), 0),
('river', 'ˈrɪvər', '/audio/river.mp3', '河', 'noun', 'The river flows to the sea.', '河流向大海。', '/audio/river_ex.mp3', '/img/river.jpg', 1, 'nature', NOW(), NOW(), 0),
('mountain', 'ˈmaʊntən', '/audio/mountain.mp3', '山', 'noun', 'The mountain is very high.', '那座山很高。', '/audio/mountain_ex.mp3', '/img/mountain.jpg', 1, 'nature', NOW(), NOW(), 0),
('sea', 'siː', '/audio/sea.mp3', '海', 'noun', 'The sea is blue.', '海是蓝色的。', '/audio/sea_ex.mp3', '/img/sea.jpg', 1, 'nature', NOW(), NOW(), 0),
('lake', 'leɪk', '/audio/lake.mp3', '湖', 'noun', 'The lake is calm.', '湖面很平静。', '/audio/lake_ex.mp3', '/img/lake.jpg', 1, 'nature', NOW(), NOW(), 0);

-- 少儿英语高频词汇
INSERT INTO word (word, phonetic, phonetic_audio, meaning, part_of_speech, example_sentence, example_translation, example_audio, image_url, difficulty, category, create_time, update_time, deleted) VALUES
('beautiful', 'ˈbjuːtɪfl', '/audio/beautiful.mp3', '美丽的', 'adjective', 'The flower is beautiful.', '这朵花很美丽。', '/audio/beautiful_ex.mp3', '/img/beautiful.jpg', 2, 'advanced', NOW(), NOW(), 0),
('quickly', 'ˈkwɪkli', '/audio/quickly.mp3', '快地', 'adverb', 'Please come quickly.', '请快点来。', '/audio/quickly_ex.mp3', '/img/quickly.jpg', 2, 'advanced', NOW(), NOW(), 0),
('slowly', 'ˈsloʊli', '/audio/slowly.mp3', '慢地', 'adverb', 'Speak slowly please.', '请慢慢说。', '/audio/slowly_ex.mp3', '/img/slowly.jpg', 2, 'advanced', NOW(), NOW(), 0),
('always', 'ˈɔːlweɪz', '/audio/always.mp3', '总是', 'adverb', 'I always get up early.', '我总是早起。', '/audio/always_ex.mp3', '/img/always.jpg', 2, 'advanced', NOW(), NOW(), 0),
('never', 'ˈnevər', '/audio/never.mp3', '从不', 'adverb', 'I never give up.', '我从不放弃。', '/audio/never_ex.mp3', '/img/never.jpg', 2, 'advanced', NOW(), NOW(), 0),
('sometimes', 'ˈsʌmtaɪmz', '/audio/sometimes.mp3', '有时', 'adverb', 'Sometimes I play football.', '有时我踢足球。', '/audio/sometimes_ex.mp3', '/img/sometimes.jpg', 2, 'advanced', NOW(), NOW(), 0),
('big', 'bɪɡ', '/audio/big.mp3', '大的', 'adjective', 'This is a big elephant.', '这是一头大象。', '/audio/big_ex.mp3', '/img/big.jpg', 1, 'advanced', NOW(), NOW(), 0),
('small', 'smɔːl', '/audio/small.mp3', '小的', 'adjective', 'The mouse is small.', '老鼠很小。', '/audio/small_ex.mp3', '/img/small.jpg', 1, 'advanced', NOW(), NOW(), 0),
('tall', 'tɔːl', '/audio/tall.mp3', '高的', 'adjective', 'The building is very tall.', '这栋楼很高。', '/audio/tall_ex.mp3', '/img/tall.jpg', 1, 'advanced', NOW(), NOW(), 0),
('short', 'ʃɔːrt', '/audio/short.mp3', '矮的/短的', 'adjective', 'He is short.', '他矮。', '/audio/short_ex.mp3', '/img/short.jpg', 1, 'advanced', NOW(), NOW(), 0),
('new', 'nuː', '/audio/new.mp3', '新的', 'adjective', 'I have a new book.', '我有一本新书。', '/audio/new_ex.mp3', '/img/new.jpg', 1, 'advanced', NOW(), NOW(), 0),
('old', 'oʊld', '/audio/old.mp3', '旧的/老的', 'adjective', 'This house is old.', '这房子很旧。', '/audio/old_ex.mp3', '/img/old.jpg', 1, 'advanced', NOW(), NOW(), 0),
('good', 'ɡʊd', '/audio/good.mp3', '好的', 'adjective', 'This is a good idea.', '这是个好主意。', '/audio/good_ex.mp3', '/img/good.jpg', 1, 'advanced', NOW(), NOW(), 0),
('bad', 'bæd', '/audio/bad.mp3', '坏的', 'adjective', 'This is bad weather.', '这是坏天气。', '/audio/bad_ex.mp3', '/img/bad.jpg', 1, 'advanced', NOW(), NOW(), 0),
('hot', 'hɑːt', '/audio/hot.mp3', '热的', 'adjective', 'It is very hot today.', '今天很热。', '/audio/hot_ex.mp3', '/img/hot.jpg', 1, 'advanced', NOW(), NOW(), 0),
('cold', 'koʊld', '/audio/cold.mp3', '冷的', 'adjective', 'Ice cream is cold.', '冰淇淋是冷的。', '/audio/cold_ex.mp3', '/img/cold.jpg', 1, 'advanced', NOW(), NOW(), 0),
('warm', 'wɔːrm', '/audio/warm.mp3', '暖和的', 'adjective', 'Spring is warm.', '春天很暖和。', '/audio/warm_ex.mp3', '/img/warm.jpg', 1, 'advanced', NOW(), NOW(), 0),
('cool', 'kuːl', '/audio/cool.mp3', '凉爽的', 'adjective', 'Autumn is cool.', '秋天很凉爽。', '/audio/cool_ex.mp3', '/img/cool.jpg', 1, 'advanced', NOW(), NOW(), 0),
('easy', 'ˈiːzi', '/audio/easy.mp3', '容易的', 'adjective', 'This problem is easy.', '这个问题很简单。', '/audio/easy_ex.mp3', '/img/easy.jpg', 1, 'advanced', NOW(), NOW(), 0),
('difficult', 'ˈdɪfɪkəlt', '/audio/difficult.mp3', '困难的', 'adjective', 'This problem is difficult.', '这个问题很难。', '/audio/difficult_ex.mp3', '/img/difficult.jpg', 2, 'advanced', NOW(), NOW(), 0);

SELECT COUNT(*) as total_words FROM word WHERE deleted = 0;
