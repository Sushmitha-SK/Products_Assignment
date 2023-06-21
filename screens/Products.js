import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, TextInput, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';

const Products = () => {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [ind, setInd] = useState(0)
    const [oldData, setOldData] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null);

    const searchRef = useRef();
    const listRef = useRef();

    const URL = 'https://fakestoreapi.com/products'

    useEffect(() => {
        axios.get(URL)
            .then(response => {
                console.log('Response', response.data);
                setData(response.data);
                setOldData(response.data);
            })
            .catch(error => {
                console.log('Error', error);
            });
    }, []);

    const onSearch = (text) => {
        if (text === '') {
            setData(oldData);
        } else {
            axios.get(URL)
                .then(response => {
                    let tempList = response.data.filter(item => {
                        return item.title.toLowerCase().indexOf(text.toLowerCase()) > -1;
                    });
                    setData(tempList);
                })
                .catch(error => {
                    console.log('Error', error);
                });
        }
    };
    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#f4f8f8' }}>
                <View style={{
                    marginTop: '15%', display: 'flex', justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{ fontWeight: 700, fontSize: 20, color: '#181725' }}>Find Products</Text>
                </View>

                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 70,
                    marginTop: 20,
                    marginBottom: 5,
                    justifyContent: 'space-between',
                }}>
                    <View style={{
                        width: '82%',
                        height: 50,
                        borderRadius: 5,
                        backgroundColor: '#FFF',
                        borderWidth: 0.2,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 15,
                    }}>
                        <Image
                            source={require('../assets/search.png')}
                            style={{ width: 24, height: 24, marginLeft: 15, opacity: 0.5 }}
                        />
                        <TextInput
                            ref={searchRef}
                            placeholder="What are you looking for?"
                            style={{ width: '76%', height: 50, marginLeft: 2 }}
                            value={search}
                            onChangeText={txt => {
                                onSearch(txt);
                                setSearch(txt);
                            }}
                        />
                        {search === '' ? null : (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => {
                                    searchRef.current.clear();
                                    onSearch('');
                                    setSearch('');
                                }}>
                                <Image
                                    source={require('../assets/close.png')}
                                    style={{ width: 16, height: 16, opacity: 0.5 }}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        style={{
                            marginRight: 15,
                        }} onPress={() => {
                            setVisible(true);
                        }}>
                        <Image source={require('../assets/filter.png')}
                            style={{ width: 24, height: 24 }}
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={data}
                    ref={listRef}
                    showsVerticalScrollIndicator={false}
                    initialScrollIndex={ind}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => setSelectedProduct(item)}
                            >
                                <View style={{
                                    width: '90%',
                                    borderRadius: 15,
                                    // borderWidth: 0.5,
                                    alignSelf: 'center',
                                    marginTop: 20,
                                    marginBottom: index == data.length - 1 ? 20 : 0,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: '#fff',
                                    elevation: 5,
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 15,
                                }}>
                                    <Image source={{ uri: item.image }}
                                        style={{
                                            width: 60,
                                            height: '90%',
                                            marginLeft: 10,
                                            borderRadius: 10
                                        }}
                                    />
                                    <View style={{ width: '90%' }}>
                                        <Text style={{
                                            fontWeight: '600',
                                            marginLeft: 10,
                                            marginTop: 10
                                        }}>
                                            {item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title}
                                        </Text>

                                        <Text style={{
                                            fontWeight: '600',
                                            marginLeft: 10,
                                            marginTop: 10,
                                            flexWrap: 'wrap',
                                            height: 40,
                                        }}>
                                            {item.description.length > 38 ? `${item.description.substring(0, 30)}...` : item.description}
                                        </Text>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginBottom: 10,
                                        }}>
                                            <Text style={{
                                                fontSize: 18,
                                                marginLeft: 10,
                                                fontWeight: 800,
                                                color: '#53B175',
                                            }}>
                                                {'$ ' + item.price}
                                            </Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginLeft: 'auto',
                                                marginRight: 60,
                                            }}>
                                                <Text style={{
                                                    fontSize: 14,
                                                    marginLeft: 50,
                                                    fontWeight: 700,
                                                    color: '#F2994A'
                                                }}>
                                                    {item.rating.rate}
                                                </Text>
                                                <Image
                                                    source={require('../assets/star.png')}
                                                    style={{ width: 12, height: 12, marginLeft: 5 }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={selectedProduct !== null}
                    onRequestClose={() => setSelectedProduct(null)}
                >
                    {selectedProduct && (
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Image
                                    source={{ uri: selectedProduct.image }}
                                    style={styles.productImage}
                                />
                                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                                <View style={styles.priceRatingContainer}>
                                    <Text style={styles.priceText}>Price: ${selectedProduct.price}</Text>
                                    <View style={styles.ratingContainer}>
                                        <Text style={styles.ratingText}>Rating: </Text>
                                        <Text style={styles.ratingValue}>{selectedProduct.rating.rate}</Text>
                                        <Image
                                            source={require('../assets/star.png')}
                                            style={styles.starIcon}
                                        />
                                    </View>
                                </View>
                                <Text style={styles.modalDescription}>{selectedProduct.description}</Text>

                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setSelectedProduct(null)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Modal>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={visible}
                    onRequestClose={() => {
                        setVisible(!visible);
                    }}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,.5)',
                    }}>
                        <View style={{
                            width: '80%',
                            height: 200,
                            borderRadius: 10,
                            backgroundColor: '#fff',
                        }}>
                            <TouchableOpacity style={{
                                width: '100%',
                                height: 50,
                                borderBottomColor: '#7c7c7c',
                                borderBottomWidth: 0.3,
                                justifyContent: 'center',
                                paddingLeft: 20
                            }}
                                onPress={() => {
                                    let tempList = data.sort((a, b) =>
                                        a.title > b.title ? 1 : -1,
                                    );
                                    setData(tempList);
                                    listRef.current.scrollToIndex({ animated: true, index: 0 });
                                    setVisible(false);
                                }}>
                                <Text style={{ fontSize: 16, color: '#181725' }}>
                                    Sort By Name
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                width: '100%',
                                height: 50,
                                borderBottomWidth: 0.3,
                                borderBottomColor: '#7c7c7c',
                                justifyContent: 'center',
                                paddingLeft: 20
                            }}
                                onPress={() => {
                                    setData(data.sort((a, b) => a.price - b.price))
                                    listRef.current.scrollToIndex({ animated: true, index: 0 });
                                    setVisible(false);
                                }}>
                                <Text style={{ fontSize: 16, color: '#181725' }}>
                                    Low to High Price
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                width: '100%',
                                height: 50,
                                borderBottomWidth: 0.5,
                                justifyContent: 'center',
                                borderBottomWidth: 0.3,
                                borderBottomColor: '#7c7c7c',
                                paddingLeft: 20
                            }}
                                onPress={() => {
                                    setData(data.sort((a, b) => b.price - a.price))
                                    listRef.current.scrollToIndex({ animated: true, index: 0 });
                                    setVisible(false);
                                }}>
                                <Text style={{ fontSize: 16, color: '#181725' }}>
                                    High to Low Price
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                width: '100%',
                                height: 50,
                                borderBottomWidth: 0.5,
                                justifyContent: 'center',
                                borderBottomWidth: 0.3,
                                borderBottomColor: '#7c7c7c',
                                paddingLeft: 20
                            }}
                                onPress={() => {
                                    setData(data.sort((a, b) => b.rating.rate - a.rating.rate))
                                    listRef.current.scrollToIndex({ animated: true, index: 0 });
                                    setVisible(false);
                                }}>
                                <Text style={{ fontSize: 16, color: '#181725' }}>
                                    Sort By Rating
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
            </View>
        </>
    )
}

export default Products

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 14,
        marginBottom: 20,
        color: '#7C7C7C'
    },
    closeButton: {
        backgroundColor: '#53B175',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    productImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 10,
    },
    priceRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 5,
    },
    ratingValue: {
        fontSize: 16,
        fontWeight: '600',
        color: 'orange',
        marginRight: 5,
    },
    starIcon: {
        width: 12,
        height: 12,
    },
});