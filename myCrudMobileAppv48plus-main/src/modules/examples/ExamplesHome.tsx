import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DataSource } from 'typeorm';
import useSqliteDataSource from '../../global/datasources/useSqliteDataSource';
import { Author } from '../examples/entities/author.entity';
import { Category } from '../examples/entities/category.entity';
import { Post } from '../examples/entities/post.entity';
import { IAppState } from '../examples/types/definitions';

type Props = {
    dataSource: DataSource;
}

const ExamplesHome: React.FC<Props> = ({ dataSource }) => {

    const [state, setState] = useState<IAppState>({
        loadedPost: null,
        progress: 'Post is being saved',
        savedPost: false,
    });

    const runDemo = async () => {

        const category1 = new Category();
        category1.name = "TypeScript";

        const category2 = new Category();
        category2.name = "Programming";

        const author = new Author();
        author.name = "Person";

        const post = new Post();
        post.title = "Control flow based type analysis";
        post.text = "TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.";
        post.categories = [category1, category2];
        post.author = author;

        const postRepository = dataSource.getRepository(Post);
        await postRepository.save(post);

        console.log("Post has been saved");
        setState({
            ...state,
            progress: "Post has been saved"
        });

        const loadedPost = await postRepository.findOne({ where: { id: post.id }, relations: ["author", "categories"] });

        if (loadedPost) {
            console.log("Post has been loaded: ", loadedPost);
            setState({
                ...state,
                loadedPost: loadedPost
            });
        }
    }


    useEffect(() => {
        runDemo();
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                Welcome to the Expo Example for TypeORM!
            </Text>
            <Text style={styles.small}>
                {state.progress}
            </Text>
            <Text style={styles.small}>
                {JSON.stringify(state.loadedPost)}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    small: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default ExamplesHome;