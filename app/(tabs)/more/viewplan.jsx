// Pagina de View de planos
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { getMemberships } from "../../../src/services/memberships.services";
import * as S from "../../../src/styles/planes.styles";

export default function ViewPlan(){
    
    const navigation = useNavigation();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getMemberships();
                setPlans(data);
            } catch (e) {
                console.error("Error al cargar planes:", e);

            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#f7a82a" style={{ marginTop: 50 }} />;
    
    return(
        <S.Container>
            <Text style={{ fontSize: 25, fontWeight: '800', marginBottom: 20, paddingHorizontal: 25, textAlign: 'center', color: '#3D8E88' }}>
                Planes disponibles
            </Text>

            <S.PlansWrapper>
                {plans.map((plan) => {
                    const isHighlighted = !!plan.destacado;
                    const themeColor = plan.tema === "naranja" ? "#f7a82a" : "#3D8E88";
                    const isFremium = plan.codigo?.toLowerCase() === "fremium";

                    return (
                        <S.PlanCard key={plan.codigo} highlighted={isHighlighted} themeColor={themeColor}>
                            {isHighlighted && <Text style={{ color: '#F7A82A' }}>Destacado</Text>}

                            <S.PlanTitle textColor={themeColor}>{plan.titulo}</S.PlanTitle>
                            <S.PriceLabel>{plan.precio_label}</S.PriceLabel>

                            {plan.beneficios?.map((feature, idx) => (
                                <S.BenefitItem key={idx}>
                                    <Text style={{ color: '#3d8e88', marginRight: 8 }}>•</Text>
                                    <Text style={{ color: '#555' }}>{feature}</Text>
                                </S.BenefitItem>
                            ))}

                            <S.PlanButton
                                isHighlighted={isHighlighted}
                                onPress={() => {
                                    if (isFremium) {
                                        navigation.navigate("/(tabs)/dashboard");
                                    } else {
                                        navigation.navigate("Checkout", { planId: plan.codigo });
                                    }
                                }}
                            >
                                <S.ButtonText>
                                    {isFremium ? "Usar plan freemium" : plan.text_boton || "Elegir este plan"}
                                </S.ButtonText>
                            </S.PlanButton>
                        </S.PlanCard>
                    )
                })}
            </S.PlansWrapper>
        </S.Container>
    )
}