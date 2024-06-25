from rest_framework import serializers
from .models import User, Profile, Blog, BlogCategory, Comment, BlogLike, CommentLike, Category

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'username', 'first_name', 'last_name', 'bio', 'image']

    def get_username(self, obj):
        return obj.user.username

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name
    

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    blog = serializers.PrimaryKeyRelatedField(queryset=Blog.objects.all(), required=False)

    class Meta:
        model = Comment
        fields = ['id', 'blog', 'user', 'content']
        read_only_fields = ['user']

    def validate_blog(self, value):
        """
        Check if the blog exists.
        """
        if not value:
            raise serializers.ValidationError("Blog must be specified.")
        return value

class BlogLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogLike
        fields = '__all__'

class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = '__all__'

class CommentCountSerializer(serializers.Serializer):
    blog_id = serializers.IntegerField()
    comment_count = serializers.IntegerField()

class BlogSerializer(serializers.ModelSerializer):
    categories = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Blog
        fields = ['id', 'user_id', 'title', 'content',  'image','created_datetime', 'updated_datetime', 'draft', 'hidden', 'categories']
        read_only_fields = ['created_datetime', 'updated_datetime']

    def create(self, validated_data):
        categories_data = validated_data.pop('categories', [])
        user_id = validated_data.pop('user_id')
        
        # Create the Blog instance
        blog = Blog.objects.create(user_id=user_id, **validated_data)

        # Process categories
        for category_name in categories_data:
            category, created = Category.objects.get_or_create(category_name=category_name.strip())  # Adjust as per your Category model
            BlogCategory.objects.create(blog=blog, category=category)

        return blog

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.draft = validated_data.get('draft', instance.draft)
        instance.hidden = validated_data.get('hidden', instance.hidden)

        categories_data = validated_data.get('categories', [])
        if categories_data:
            instance.categories.clear()
            for category_name in categories_data:
                category, created = Category.objects.get_or_create(category_name=category_name.strip())  # Adjust as per your Category model
                BlogCategory.objects.create(blog=instance, category=category)

        instance.save()
        return instance

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['blog', 'category']

    def create(self, validated_data):
        blog = validated_data['blog']
        category_data = validated_data.pop('category')
        blog_category = BlogCategory.objects.create(blog=blog, category=category_data)
        return blog_category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category_name']

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'blog', 'category']